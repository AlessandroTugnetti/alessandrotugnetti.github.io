require 'minitest/autorun'
require 'jekyll'
require 'minitest/mock'
require_relative '../_plugins/google-scholar-citations'

class GoogleScholarMetricsTest < Minitest::Test
  def setup
    @articles = { 'paperID' => { 'title' => 'Non-fungible tokens' } }
  end

  def profile(count, title: 'Non‐fungible tokens', article: 'paperID')
    %(<table><tr class="gsc_a_tr"><td><a class="gsc_a_at" href="/citations?citation_for_view=profile:#{article}">#{title}</a></td><td><a class="gsc_a_ac" href="https://scholar.google.com/scholar?cites=123">#{count}</a></td></tr></table>)
  end

  def test_correct_paper_and_real_count_including_explicit_zero
    assert_equal 137, Jekyll::GoogleScholarMetrics.parse_profile(profile('137'), 'profile', @articles)['paperID']['count']
    assert_equal 0, Jekyll::GoogleScholarMetrics.parse_profile(profile('0'), 'profile', @articles)['paperID']['count']
  end

  def test_missing_counts_wrong_articles_and_block_pages_are_unknown
    ['', '<html>unusual traffic</html>', profile(''), profile('12', title: 'Other work'), profile('12', article: 'otherID')].each do |html|
      assert_empty Jekyll::GoogleScholarMetrics.parse_profile(html, 'profile', @articles)
    end
  end

  def test_only_dated_verified_snapshots_can_be_used
    assert_equal({}, Jekyll::GoogleScholarMetrics.verified_snapshot({ 'count' => nil, 'checked_on' => '2026-10-20' }))
    assert_equal({}, Jekyll::GoogleScholarMetrics.verified_snapshot({ 'count' => 35, 'checked_on' => '' }))
    record = { 'count' => 35, 'checked_on' => '2026-10-20' }
    assert_equal record, Jekyll::GoogleScholarMetrics.verified_snapshot(record)
  end
  def test_blocked_google_retains_verified_count_and_original_date
    record = { 'title' => 'Non-fungible tokens', 'count' => 137, 'checked_on' => '2026-10-20' }
    site = Struct.new(:data).new({ 'google_scholar' => { 'profile_id' => 'profile', 'articles' => { 'paperID' => record } } })
    Jekyll::GoogleScholarMetrics.instance_variable_set(:@profiles, {})
    URI.stub(:open, ->(*args) { raise IOError, 'blocked' }) do
      result = Jekyll::GoogleScholarMetrics.metrics(site, 'profile', 'paperID')
      assert_equal 137, result['count']
      assert_equal '2026-10-20', result['checked_on']
      assert_equal({}, Jekyll::GoogleScholarMetrics.metrics(site, 'profile', 'unknownID'))
    end
  end

end
