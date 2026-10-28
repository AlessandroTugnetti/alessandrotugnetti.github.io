require 'cgi'

module Jekyll
  module AuthorLinks
    def linked_author(name)
      display = name.to_s.strip
      canonical = CGI.unescapeHTML(display).unicode_normalize(:nfc).downcase
      authors = @context.registers[:site].data.fetch('authors', [])
      author = authors.find { |a| a.fetch('aliases').any? { |n| n.unicode_normalize(:nfc).downcase == canonical } }
      text = CGI.escapeHTML(CGI.unescapeHTML(display))
      return text unless author && author['url'].start_with?('https://')
      %(<a href="#{CGI.escapeHTML(author['url'])}">#{text}</a>)
    end

    def linked_authors(names)
      names.to_s.split(/(,\s+|\s+and\s+)/).map do |part|
        part.match?(/\A(?:,\s+|\s+and\s+)\z/) ? CGI.escapeHTML(part) : linked_author(part)
      end.join
    end
  end
end
Liquid::Template.register_filter(Jekyll::AuthorLinks)
