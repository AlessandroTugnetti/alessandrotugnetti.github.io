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

require_relative '../_plugins/author-links'

class AuthorLinksTest < Minitest::Test
  def render(names)
    authors = JSON.parse(File.read(File.expand_path('../_data/authors.json', __dir__)))
    site = Struct.new(:data).new({ 'authors' => authors })
    Liquid::Template.parse('{{ names | linked_authors }}').render({ 'names' => names }, registers: { site: site })
  end

  def test_initials_and_accents_keep_display_and_use_the_same_identity
    ['Roman Kräussl', 'Roman Kraussl'].each do |name|
      assert_includes render(name), 'https://scholar.google.lu/citations?user=QqwtATAAAAAJ&amp;hl=fr'
      assert_includes render(name), ">#{name}</a>"
    end
    assert_includes render('J. Pénasse'), '>J. Pénasse</a>'
    assert_includes render('E. Nekrasova'), 'https://www.linkedin.com/in/elizaveta-nekrasova-phd-b0a320176/'
  end

  def test_author_order_and_unknown_author_are_preserved
    output = render('Saverio Capra, Lorenzo Toscano and Alessandro Tugnetti')
    assert_match %r{>Saverio Capra</a>, Lorenzo Toscano and <a href=}, output
    assert_includes output, 'user=nD56QvQAAAAJ'
    refute_match %r{<a[^>]*>Lorenzo Toscano</a>}, output
  end

  def test_unrecognized_names_are_escaped_not_injected
    assert_equal '&lt;img src=x onerror=alert(1)&gt;', render('<img src=x onerror=alert(1)>')
  end
end
