require 'json'
require 'date'
require 'nokogiri'
require 'open-uri'
require 'uri'

module Jekyll
  # A missing/blocked Scholar response is unknown, never an inferred zero.
  module GoogleScholarMetrics
    class << self
      def normalize_title(title)
        title.to_s.downcase.tr("‐‑–—", '----').gsub(/\s+/, ' ').strip
      end

      def parse_profile(html, profile, articles, checked_on: Date.today.iso8601)
        doc = Nokogiri::HTML(html)
        articles.each_with_object({}) do |(article_id, expected), found|
          row = doc.css('tr.gsc_a_tr').find do |candidate|
            link = candidate.at_css('a.gsc_a_at')
            link && URI.decode_www_form(URI.parse(link['href']).query.to_s).to_h['citation_for_view'] == "#{profile}:#{article_id}"
          end
          next unless row
          title = row.at_css('a.gsc_a_at').text
          next unless normalize_title(title) == normalize_title(expected['title'])
          cited = row.at_css('a.gsc_a_ac')
          value = cited&.text&.strip&.delete(',')
          next unless value&.match?(/\A\d+\z/)
          cluster = URI.decode_www_form(URI.parse(cited['href'].to_s).query.to_s).to_h['cites']
          next unless cluster&.match?(/\A\d+\z/)
          found[article_id] = expected.merge('count' => value.to_i, 'checked_on' => checked_on,
            'cited_by_url' => "https://scholar.google.com/scholar?cites=#{cluster}&hl=en")
        end
      end

      def verified_snapshot(record)
        return {} unless record && record['count'].is_a?(Integer) && record['count'] >= 0
        Date.iso8601(record['checked_on'].to_s)
        record
      rescue ArgumentError
        {}
      end

      def metrics(site, profile, article_id)
        @profiles ||= {}
        snapshot = site.data.fetch('google_scholar', {})
        return {} unless snapshot['profile_id'] == profile
        articles = snapshot.fetch('articles', {})
        return {} unless articles.key?(article_id)
        unless @profiles.key?(profile)
          begin
            url = "https://scholar.google.com/citations?user=#{URI.encode_www_form_component(profile)}&hl=en&pagesize=100"
            html = URI.open(url, 'User-Agent' => 'Mozilla/5.0', open_timeout: 8, read_timeout: 8, &:read)
            @profiles[profile] = parse_profile(html, profile, articles, checked_on: site.time.strftime('%Y-%m-%d'))
          rescue StandardError => error
            Jekyll.logger.warn('Google Scholar:', "#{error.class}; retaining dated verified snapshot")
            @profiles[profile] = {}
          end
        end
        @profiles[profile][article_id] || verified_snapshot(articles[article_id])
      end
    end
  end

  class GoogleScholarCitationsTag < Liquid::Tag
    def initialize(tag_name, params, tokens)
      super
      @profile, @article, @field = params.split
      @field ||= 'count'
    end

    def render(context)
      return '' unless @profile && @article && %w[count checked_on cited_by_url].include?(@field)
      record = GoogleScholarMetrics.metrics(context.registers[:site], context[@profile], context[@article])
      record.fetch(@field, '').to_s
    end
  end
end
Liquid::Template.register_tag('google_scholar_citations', Jekyll::GoogleScholarCitationsTag)
