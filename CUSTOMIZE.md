Future Ale, if you need the bibliography, look at the end of this code (Ale of the Past, kiss to Monia)
# Customize

Here we will give you some tips on how to customize the website. One important thing to note is that **ALL** the changes you make should be done on the **main** branch of your repository. The `gh-pages` branch is automatically overwritten every time you make a change to the main branch.

<!--ts-->

- [Customize](#customize)
  - [Project structure](#project-structure)
  - [Configuration](#configuration)
  - [Modifying the CV information](#modifying-the-cv-information)
  - [Modifying the user and repository information](#modifying-the-user-and-repository-information)
  - [Creating new pages](#creating-new-pages)
  - [Creating new blog posts](#creating-new-blog-posts)
  - [Creating new projects](#creating-new-projects)
  - [Adding some news](#adding-some-news)
  - [Adding Collections](#adding-collections)
  - [Adding a new publication](#adding-a-new-publication)
    - [Author annotation](#author-annotation)
    - [Buttons (through custom bibtex keywords)](#buttons-through-custom-bibtex-keywords)
  - [Changing theme color](#changing-theme-color)
  - [Adding social media information](#adding-social-media-information)
  - [Adding a newsletter](#adding-a-newsletter)
  - [Removing content](#removing-content)
    - [Removing the blog page](#removing-the-blog-page)
    - [Removing the news section](#removing-the-news-section)
    - [Removing the projects page](#removing-the-projects-page)
    - [Removing the publications page](#removing-the-publications-page)
    - [Removing the repositories page](#removing-the-repositories-page)
  - [Adding Token for Lighthouse Badger](#adding-token-for-lighthouse-badger)
    - [Personal Access Token (fine-grained) Permissions for Lighthouse Badger:](#personal-access-token-fine-grained-permissions-for-lighthouse-badger)
  - [Customizing fonts, spacing, and more](#customizing-fonts-spacing-and-more)
  - [Scheduled Posts](#scheduled-posts)
    - [Name Format](#name-format)
    - [Important Notes](#important-notes)

<!--te-->

## Project structure

The project is structured as follows, focusing on the main components that you will need to modify:

```txt
.
├── 📂 assets/: contains the assets that are displayed in the website
│   └── 📂 json/
    │   └── 📄 resume.json: CV in JSON format (https://jsonresume.org/)
├── 📂 _bibliography/
│   └── 📄 papers.bib: bibliography in BibTeX format
├── 📂 _books/: contains the bookshelf pages
├── 📄 _config.yml: the configuration file of the template
├── 📂 _data/: contains some of the data used in the template
│   ├── 📄 cv.yml: CV in YAML format, used when assets/json/resume.json is not found
│   ├── 📄 repositories.yml: users and repositories info in YAML format
│   └── 📄 socials.yml: your social media and contact info in YAML format
├── 📂 _includes/: contains code parts that are included in the main HTML file
│   └── 📄 news.liquid: defines the news section layout in the about page
├── 📂 _layouts/: contains the layouts to choose from in the frontmatter of the Markdown files
├── 📂 _news/: the news that will appear in the news section in the about page
├── 📂 _pages/: contains the pages of the website
|   └── 📄 404.md: 404 page (page not found)
├── 📂 _posts/: contains the blog posts
├── 📂 _projects/: contains the projects
└── 📂 _sass/: contains the SASS files that define the style of the website
    ├── 📄 _base.scss: base style of the website
    ├── 📄 _cv.scss: style of the CV page
    ├── 📄 _distill.scss: style of the Distill articles
    ├── 📄 _layout.scss: style of the overall layout
    ├── 📄 _themes.scss: themes colors and a few icons
    └── 📄 _variables.scss: variables used in the SASS files
```

## Configuration

The configuration file [\_config.yml](_config.yml) contains the main configuration of the website. Most of the settings is self-explanatory and we also tried to add as much comments as possible. If you have any questions, please check if it was not already answered in the [FAQ](FAQ.md).

> Note that the `url` and `baseurl` settings are used to generate the links of the website, as explained in the [install instructions](INSTALL.md).

All changes made to this file are only visible after you rebuild the website. That means that you need to run `bundle exec jekyll serve` again if you are running the website locally or push your changes to GitHub if you are using GitHub Pages. All other changes are visible immediately, you only need to refresh the page.

## Modifying the CV information

There are currently 2 different ways of generating the CV page content. The first one is by using a json file located in [assets/json/resume.json](assets/json/resume.json). It is a [known standard](https://jsonresume.org/) for creating a CV programmatically. The second one, currently used as a fallback when the json file is not found, is by using a yml file located in [\_data/cv.yml](_data/cv.yml). This was the original way of creating the CV page content and since it is more human readable than a json file we decided to keep it as an option.

What this means is, if there is no resume data defined in [\_config.yml](_config.yml) and loaded via a json file, it will load the contents of [\_data/cv.yml](_data/cv.yml). If you want to use the [\_data/cv.yml](_data/cv.yml) file as the source of your CV, you must delete the [assets/json/resume.json](assets/json/resume.json) file.

## Modifying the user and repository information

The user and repository information is defined in [\_data/repositories.yml](_data/repositories.yml). You can add as many users and repositories as you want. Both informations are used in the `repositories` section.

## Creating new pages

You can create new pages by adding new Markdown files in the [\_pages](_pages/) directory. The easiest way to do this is to copy an existing page and modify it. You can choose the layout of the page by changing the [layout](https://jekyllrb.com/docs/layouts/) attribute in the [frontmatter](https://jekyllrb.com/docs/front-matter/) of the Markdown file, and also the path to access it by changing the [permalink](https://jekyllrb.com/docs/permalinks/) attribute. You can also add new layouts in the [\_layouts](_layouts/) directory if you feel the need for it.

## Creating new blog posts

To create a new blog post, you can add a new Markdown file in the [\_posts](_posts/) directory, which is the [default location for posts in Jekyll](https://jekyllrb.com/docs/posts/). The [name of the file must follow](https://jekyllrb.com/docs/posts/#creating-posts) the format `YYYY-MM-DD-title.md`. The easiest way to do this is to copy an existing blog post and modify it. Note that some blog posts have optional fields in the [frontmatter](https://jekyllrb.com/docs/front-matter/) that are used to enable specific behaviors or functions.

If you want to create blog posts that are not ready to be published, but you want to track it with git, you can create a [\_drafts](https://jekyllrb.com/docs/posts/#drafts) directory and store them there.

Note that `posts` is also a collection, but it is a default collection created automatically by Jekyll. To access the posts, you can use the `site.posts` variable in your templates.

## Creating new projects

You can create new projects by adding new Markdown files in the [\_projects](_projects/) directory. The easiest way to do this is to copy an existing project and modify it.

## Adding some news

You can add news in the about page by adding new Markdown files in the [\_news](_news/) directory. There are currently two types of news: inline news and news with a link. News with a link take you to a new page while inline news are displayed directly in the about page. The easiest way to create yours is to copy an existing news and modify it.

## Adding Collections

This Jekyll theme implements [collections](https://jekyllrb.com/docs/collections/) to let you break up your work into categories. The theme comes with three default collections: `news`, `projects`, and `books`. Items from the `news` collection are automatically displayed on the home page, while items from the `projects` collection are displayed on a responsive grid on projects page and items from the `books` collection are displayed on its own `bookshelf` page inside `submenus`.

You can easily create your own collections, apps, short stories, courses, or whatever your creative work is. To do this, edit the collections in the [\_config.yml](_config.yml) file, create a corresponding folder, and create a landing page for your collection, similar to [\_pages/projects.md](_pages/projects.md).

If you wish to create a collection with support for categories and tags, like the blog posts, you just need to add this collection to the `jekyll-archives` section of your [\_config.yml](_config.yml) file. You can check how this is done with the `books` collection. For more information about customizing the archives section or creating your own archives page, check the [jekyll-archives-v2 documentation](https://george-gca.github.io/jekyll-archives-v2/).

To access the collections, you can use the `site.COLLECTION_NAME` variable in your templates.

## Adding a new publication

To add publications create a new entry in the [\_bibliography/papers.bib](_bibliography/papers.bib) file. You can find the BibTeX entry of a publication in Google Scholar by clicking on the quotation marks below the publication title, then clicking on "BibTeX", or also in the conference page itself. By default, the publications will be sorted by year and the most recent will be displayed first. You can change this behavior and more in the `Jekyll Scholar` section in [\_config.yml](_config.yml) file.

You can add extra information to a publication, like a PDF file in the `assets/pdfs/` directory and add the path to the PDF file in the BibTeX entry with the `pdf` field. Some of the supported fields are: `abstract`, `altmetric`, `annotation`, `arxiv`, `bibtex_show`, `blog`, `code`, `dimensions`, `doi`, `eprint`, `html`, `isbn`, `pdf`, `pmid`, `poster`, `slides`, `supp`, `video`, and `website`.

### Author annotation

In publications, the author entry for yourself is identified by string array `scholar:last_name` and string array `scholar:first_name` in [\_config.yml](_config.yml). For example, if you have the following entry in your [\_config.yml](_config.yml):

```yaml
scholar:
  last_name: [Einstein]
  first_name: [Albert, A.]
```

If the entry matches one form of the last names and the first names, it will be underlined. Keep meta-information about your co-authors in [\_data/coauthors.yml](_data/coauthors.yml) and Jekyll will insert links to their webpages automatically. The co-author data format is as follows, with the last names lower cased and without accents as the key:

```yaml
"adams":
  - firstname: ["Edwin", "E.", "E. P.", "Edwin Plimpton"]
    url: https://en.wikipedia.org/wiki/Edwin_Plimpton_Adams

"podolsky":
  - firstname: ["Boris", "B.", "B. Y.", "Boris Yakovlevich"]
    url: https://en.wikipedia.org/wiki/Boris_Podolsky

"rosen":
  - firstname: ["Nathan", "N."]
    url: https://en.wikipedia.org/wiki/Nathan_Rosen

"bach":
  - firstname: ["Johann Sebastian", "J. S."]
    url: https://en.wikipedia.org/wiki/Johann_Sebastian_Bach

  - firstname: ["Carl Philipp Emanuel", "C. P. E."]
    url: https://en.wikipedia.org/wiki/Carl_Philipp_Emanuel_Bach
```

If the entry matches one of the combinations of the last names and the first names, it will be highlighted and linked to the url provided. Note that the keys **MUST BE** lower cased and **MUST NOT** contain accents. This is because the keys are used to match the last names in the BibTeX entries, considering possible variations (see [related discussion](https://github.com/alshedivat/al-folio/discussions/2213)).

### Buttons (through custom bibtex keywords)

There are several custom bibtex keywords that you can use to affect how the entries are displayed on the webpage:

- `abbr`: Adds an abbreviation to the left of the entry. You can add links to these by creating a venue.yaml-file in the \_data folder and adding entries that match.
- `abstract`: Adds an "Abs" button that expands a hidden text field when clicked to show the abstract text
- `altmetric`: Adds an [Altmetric](https://www.altmetric.com/) badge (Note: if DOI is provided just use `true`, otherwise only add the altmetric identifier here - the link is generated automatically)
- `annotation`: Adds a popover info message to the end of the author list that can potentially be used to clarify superscripts. HTML is allowed.
- `arxiv`: Adds a link to the Arxiv website (Note: only add the arxiv identifier here - the link is generated automatically)
- `bibtex_show`: Adds a "Bib" button that expands a hidden text field with the full bibliography entry
- `blog`: Adds a "Blog" button redirecting to the specified link
- `code`: Adds a "Code" button redirecting to the specified link
- `dimensions`: Adds a [Dimensions](https://www.dimensions.ai/) badge (Note: if DOI or PMID is provided just use `true`, otherwise only add the Dimensions' identifier here - the link is generated automatically)
- `html`: Inserts an "HTML" button redirecting to the user-specified link
- `pdf`: Adds a "PDF" button redirecting to a specified file (if a full link is not specified, the file will be assumed to be placed in the /assets/pdf/ directory)
- `poster`: Adds a "Poster" button redirecting to a specified file (if a full link is not specified, the file will be assumed to be placed in the /assets/pdf/ directory)
- `slides`: Adds a "Slides" button redirecting to a specified file (if a full link is not specified, the file will be assumed to be placed in the /assets/pdf/ directory)
- `supp`: Adds a "Supp" button to a specified file (if a full link is not specified, the file will be assumed to be placed in the /assets/pdf/ directory)
- `website`: Adds a "Website" button redirecting to the specified link

You can implement your own buttons by editing the [\_layouts/bib.liquid](_layouts/bib.liquid) file.

## Changing theme color

A variety of beautiful theme colors have been selected for you to choose from. The default is purple, but you can quickly change it by editing the `--global-theme-color` variable in the [\_sass/\_themes.scss](_sass/_themes.scss) file. Other color variables are listed there as well. The stock theme color options available can be found at [\_sass/\_variables.scss](_sass/_variables.scss). You can also add your own colors to this file assigning each a name for ease of use across the template.

## Adding social media information

You can add your social media links by adding the specified information in the [\_data/socials.yml](_data/socials.yml) file. This information will appear at the bottom of the `About` page and in the search results by default, but this could be changed to appear at the header of the page by setting `enable_navbar_social: true` and doesn't appear in the search by setting `socials_in_search: false`, both in [\_config.yml](_config.yml).

## Adding a newsletter

You can add a newsletter subscription form by adding the specified information at the `newsletter` section in the [\_config.yml](_config.yml) file. To set up a newsletter, you can use a service like [Loops.so](https://loops.so/), which is the current supported solution. Once you have set up your newsletter, you can add the form [endpoint](https://loops.so/docs/forms/custom-form) to the `endpoint` field in the `newsletter` section of the [\_config.yml](_config.yml) file.

Depending on your specified footer behavior, the sign up form either will appear at the bottom of the `About` page and at the bottom of blogposts if `related_posts` are enabled, or in the footer at the bottom of each page.

## Removing content

Since this template have a lot of content, you may want to remove some of it. The easiest way to achieve this and avoid merge conflicts when updating your code (as [pointed by CheariX ](https://github.com/alshedivat/al-folio/pull/2933#issuecomment-2571271117)) is to add the unwanted files to the `exclude` section in your `_config.yml` file instead of actually deleting them, for example:

```yml
exclude:
  - _news/announcement_*.md
  - _pages/blog.md
  - _posts/
  - _projects/?_project.md
  - assets/jupyter/blog.ipynb
```

Here is a list of the main components that you may want to delete, and how to do it. Don't forget if you delete a page to update the `nav_order` of the remaining pages.

### Removing the blog page

To remove the blog, you have to:

- delete [\_posts](_posts/) directory
- delete blog page [\_pages/blog.md](_pages/blog.md)
- remove reference to blog page in our [\_pages/dropdown.md](_pages/dropdown.md)
- remove the `latest_posts` part in [\_pages/about.md](_pages/about.md)
- remove the `Blog` section in the [\_config.yml](_config.yml) file and the related parts, like the `jekyll-archives`

You can also:

- delete [\_includes/latest_posts.liquid](_includes/latest_posts.liquid)
- delete [\_includes/related_posts.liquid](_includes/related_posts.liquid)
- delete [\_layouts/archive.liquid](_layouts/archive.liquid) (unless you have a custom collection that uses it)
- delete [\_plugins/external-posts.rb](_plugins/external-posts.rb)
- remove the `jekyll-archives-v2` gem from the [Gemfile](Gemfile) and the `plugins` section in [\_config.yml](_config.yml) (unless you have a custom collection that uses it)
- remove the `classifier-reborn` gem from the [Gemfile](Gemfile)

### Removing the news section

To remove the news section, you can:

- delete the [\_news](_news/) directory
- delete the file [\_includes/news.liquid](_includes/news.liquid) and the references to it in the [\_pages/about.md](_pages/about.md)
- remove the `announcements` part in [\_pages/about.md](_pages/about.md)
- remove the news part in the `Collections` section in the [\_config.yml](_config.yml) file

### Removing the projects page

To remove the projects, you can:

- delete the [\_projects](_projects/) directory
- delete the projects page [\_pages/projects.md](_pages/projects.md)
- remove reference to projects page in our [\_pages/dropdown.md](_pages/dropdown.md)
- remove projects part in the `Collections` section in the [\_config.yml](_config.yml) file

You can also:

- delete [\_includes/projects_horizontal.liquid](_includes/projects_horizontal.liquid)
- delete [\_includes/projects.liquid](_includes/projects.liquid)

### Removing the publications page

To remove the publications, you can:

- delete the [\_bibliography](_bibliography/) directory
- delete the publications page [\_pages/publications.md](_pages/publications.md)
- remove reference to publications page in our [\_pages/dropdown.md](_pages/dropdown.md)
- remove `Jekyll Scholar` section in the [\_config.yml](_config.yml) file

You can also:

- delete the [\_layouts/bib.liquid](_layouts/bib.liquid) file
- delete [\_includes/bib_search.liquid](_includes/bib_search.liquid)
- delete [\_includes/citation.liquid](_includes/citation.liquid)
- delete [\_includes/selected_papers.liquid](_includes/selected_papers.liquid)
- delete [\_plugins/google-scholar-citations.rb](_plugins/google-scholar-citations.rb)
- delete [\_plugins/hide-custom-bibtex.rb](_plugins/hide-custom-bibtex.rb)
- delete [\_plugins/inspirehep-citations.rb](_plugins/inspirehep-citations.rb)
- remove the `jekyll-scholar` gem from the [Gemfile](Gemfile) and the `plugins` section in [\_config.yml](_config.yml)

### Removing the repositories page

To remove the repositories, you can:

- delete the repositories page [\_pages/repositories.md](_pages/repositories.md)
- delete [\_includes/repository/](_includes/repository/) directory

## Adding Token for Lighthouse Badger

To add secrets for [lighthouse-badger](https://github.com/alshedivat/al-folio/actions/workflows/lighthouse-badger.yml), create a [personal access token (PAT)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) and add it as a [secret](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-encrypted-secrets-for-a-repository) named `LIGHTHOUSE_BADGER_TOKEN` to your repository. The [lighthouse-badger documentation](https://github.com/MyActionWay/lighthouse-badger-workflows#lighthouse-badger-easyyml) specifies using an environment variable, but using it as a secret is more secure and appropriate for a PAT.

Also In case you face the error: "Input required and not supplied: token" in the Lighthouse Badger action, this solution resolves it.

### Personal Access Token (fine-grained) Permissions for Lighthouse Badger:

- **contents**: access: read and write
- **metadata**: access: read-only

Due to the necessary permissions (PAT and others mentioned above), it is recommended to use it as a secret rather than an environment variable.

## Customizing fonts, spacing, and more

You can customize the fonts, spacing, and more by editing [\_sass/\_base.scss](_sass/_base.scss). The easiest way to try in advance the changes is by using [chrome dev tools](https://developer.chrome.com/docs/devtools/css) or [firefox dev tools](https://firefox-source-docs.mozilla.org/devtools-user/). In there you can click in the element and find all the attributes that are set for that element and where are they. For more information on how to use this, check [chrome](https://developer.chrome.com/docs/devtools/css) and [firefox](https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/how_to/examine_and_edit_css/index.html) how-tos, and [this tutorial](https://www.youtube.com/watch?v=l0sgiwJyEu4).

## Scheduled Posts

`al-folio` contains a workflow which automatically publishes all posts scheduled at a specific day, at the end of the day (23:30). By default the action is disabled, and to enable it you need to go to `.github/workflows/` and find the file called `schedule-posts.txt`. This is the workflow file. For GitHub to recognize it as one (or to enable the action), you need to rename it to `schedule-posts.yml`.

In order to use this you need to save all of your "Completed" blog posts which are scheduled to be uploaded on a specific date, in a folder named `_scheduled/` in the root directory.

> Incomplete posts should be saved in `_drafts/`

### Name Format

In this folder you need to store your file in the same format as you would in `_posts/`

> Example file name: `2024-08-26-This file will be uploaded on 26 August.md`

### Important Notes

- The scheduler uploads posts everyday at 🕛 23:30 UTC
- It will only upload posts at 23:30 UTC of their respective scheduled days, It's not uploaded in 23:59 in case there are a lot of files as the scheduler must finish before 00:00
- It will only upload files which follow the pattern `yyyy-mm-dd-title.md`
  - This means that only markdown files will be posted
  - It means that any markdown which do not follow this pattern will not be posted
- The scheduler works by moving posts from the `_scheduled/` directory to `_posts/`, it will not post to folders like `_projects/` or `_news/`
- The date in the name of the file is the day that file will be uploaded on
  - `2024-08-27-file1.md` will not be posted before or after 27-August-2024 (Scheduler only works for posts scheduled on the present day)
  - `2025-08-27-file2.md` will be posted exactly on 27-August-2025
  - `File3.md` will not be posted at all
  - `2026-02-31-file4.md` is supposed to be posted on 31-February-2026, but there is no 31st in February hence this file will never be posted either



Bibliography entries (original file)
@string{aps = {American Physical Society,}}

@book{einstein1920relativity,
  title={Relativity: the Special and General Theory},
  author={Einstein, Albert},
  year={1920},
  publisher={Methuen & Co Ltd},
  html={relativity.html}
}

@book{einstein1956investigations,
  bibtex_show={true},
  title={Investigations on the Theory of the Brownian Movement},
  author={Einstein, Albert},
  year={1956},
  publisher={Courier Corporation},
  preview={brownian-motion.gif}
}

@article{einstein1950meaning,
  abbr={AJP},
  bibtex_show={true},
  title={The meaning of relativity},
  author={Einstein, Albert and Taub, AH},
  journal={American Journal of Physics},
  volume={18},
  number={6},
  pages={403--404},
  year={1950},
  publisher={American Association of Physics Teachers}
}

@article{PhysRev.47.777,
  abbr={PhysRev},
  title={Can Quantum-Mechanical Description of Physical Reality Be Considered Complete?},
  author={Einstein*†, A. and Podolsky*, B. and Rosen*, N.},
  abstract={In a complete theory there is an element corresponding to each element of reality. A sufficient condition for the reality of a physical quantity is the possibility of predicting it with certainty, without disturbing the system. In quantum mechanics in the case of two physical quantities described by non-commuting operators, the knowledge of one precludes the knowledge of the other. Then either (1) the description of reality given by the wave function in quantum mechanics is not complete or (2) these two quantities cannot have simultaneous reality. Consideration of the problem of making predictions concerning a system on the basis of measurements made on another system that had previously interacted with it leads to the result that if (1) is false then (2) is also false. One is thus led to conclude that the description of reality as given by a wave function is not complete.},
  journal={Phys. Rev.},
  location={New Jersey},
  volume={47},
  issue={10},
  pages={777--780},
  numpages={0},
  year={1935},
  month={May},
  publisher=aps,
  doi={10.1103/PhysRev.47.777},
  url={http://link.aps.org/doi/10.1103/PhysRev.47.777},
  html={https://journals.aps.org/pr/abstract/10.1103/PhysRev.47.777},
  pdf={example_pdf.pdf},
  altmetric={248277},
  dimensions={true},
  google_scholar_id={qyhmnyLat1gC},
  video={https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ},
  additional_info={. *More Information* can be [found here](https://github.com/alshedivat/al-folio/)},
  annotation={* Example use of superscripts<br>† Albert Einstein},
  inspirehep_id = {3255}
}

@article{einstein1905molekularkinetischen,
  title={{\"U}ber die von der molekularkinetischen Theorie der W{\"a}rme geforderte Bewegung von in ruhenden Fl{\"u}ssigkeiten suspendierten Teilchen},
  author={Einstein, A.},
  journal={Annalen der physik},
  volume={322},
  number={8},
  pages={549--560},
  year={1905},
  publisher={Wiley Online Library}
}

@article{einstein1905movement,
  abbr={Ann. Phys.},
  title={Un the movement of small particles suspended in statiunary liquids required by the molecular-kinetic theory 0f heat},
  author={Einstein, A.},
  journal={Ann. Phys.},
  volume={17},
  pages={549--560},
  year={1905}
}

@article{einstein1905electrodynamics,
  title={On the electrodynamics of moving bodies},
  author={Einstein, A.},
  year={1905}
}

@Article{einstein1905photoelectriceffect,
  bibtex_show={true},
  abbr={Ann. Phys.},
  title="{{\"U}ber einen die Erzeugung und Verwandlung des Lichtes betreffenden heuristischen Gesichtspunkt}",
  author={Albert Einstein},
  abstract={This is the abstract text.},
  journal={Ann. Phys.},
  volume={322},
  number={6},
  pages={132--148},
  year={1905},
  doi={10.1002/andp.19053220607},
  award={Albert Einstein receveid the **Nobel Prize in Physics** 1921 *for his services to Theoretical Physics, and especially for his discovery of the law of the photoelectric effect*},
  award_name={Nobel Prize}
}

@book{przibram1967letters,
  bibtex_show={true},
  title={Letters on wave mechanics},
  author={Einstein, Albert and Schrödinger, Erwin and Planck, Max and Lorentz, Hendrik Antoon and Przibram, Karl},
  year={1967},
  publisher={Vision},
  preview={wave-mechanics.gif},
  abbr={Vision}
}





{
  "basics": {
    "name": "Alessandro Tugnetti",
    "label": "Ph.D. Student",
    "image": "",
    "email": "alessandro.tugnetti@live.it",
    "phone": "",
    "url": "",
    "summary": "Currently a doctoral researcher at the University of Luxembourg’s Faculty of Law, Economics and Finance, I am passionate about applying quantitative methods to macroeconomic analysis and forecasting. Rather than being constrained by disciplinary boundaries, I focus on identifying economically significant research questions and seek to leverage my expertise in econometric modeling, time series analysis, and machine learning in senior research or quantitative finance roles.",
    "location": {
      "address": "",
      "postalCode": "",
      "city": "Luxembourg",
      "countryCode": "LU",
      "region": ""
    },
    "profiles": [
      {
        "network": "LinkedIn",
        "username": "alessandrotugnetti",
        "url": "www.linkedin.com/in/alessandrotugnetti"
      }
    ]
  },
  "work": [
    {
      "name": "DWS SA",
      "location": "Luxembourg",
      "position": "Liquidity Stress Testing Analyst",
      "url": "https://funds.dws.com/en-lu/",
      "startDate": "2021-02-01",
      "endDate": "2021-11-30",
      "summary": "Development of market and ESG risks liquidity models for passive Money Market funds",
      "highlights": ["Python","R","MATLAB","Aladdin Solution"]
    },
      {
      "name": "Accenture",
      "location": "Turin, Italy",
      "position": "Quantitative Finance and Compliance Specialist",
      "url": "https://www.accenture.com/us-en",
      "startDate": "2019-07-01",
      "endDate": "2019-11-30",
      "summary": "Validation of Intesa Sanpaolo’s bank account models to ensure compliance to P.A.D. (Payment Account Directive) regulation",
      "highlights": ["Python","R","PostgreSQL","Mathematica"]
    },
      {
      "name": "London Mutual Credit Union",
      "location": "London, UK",
      "position": "Data Analyst",
      "url": "https://creditunion.co.uk/",
      "startDate": "2017-05-01",
      "endDate": "2017-09-30",
      "summary": "Collection and analysis of client mortgage application data through the application of machine learning techniques",
      "highlights": ["Python","MATLAB", "Tableau", "SQL"]
    }
  ],
  "volunteer": [
    {
      "organization": "Serve the City",
      "location": "Luxembourg",
      "position": "Team Stëmm vun der Strooss",
      "url": "https://servethecity.lu/about/",
      "startDate": "2022-01-01",
      "endDate": "Present",
      "summary": ""
    }
  ],
  "education": [
    {
      "institution": "University of Luxembourg",
      "location": "Luxembourg",
      "url": "https://www.uni.lu/research-en/doctoral-education/dsefm/finance/",
      "area": "Finance",
      "studyType": "PhD",
      "startDate": "2022-01-17",
      "endDate": "Present",
      "score": "",
      "courses": [""]
    },
    {
      "institution": "University of Turin",
      "location": "Turin, Italy",
      "url": "https://www.finance-insurance.unito.it/do/home.pl/View?doc=courses.html",
      "area": "Quantitative Finance and Insurance",
      "studyType": "M.Sc.",
      "startDate": "2018-09-01",
      "endDate": "2020-11-01",
      "score": "",
      "courses": [""]
    },
    {
      "institution": "Collegio Carlo Alberto",
      "location": "Turin, Italy",
      "url": "https://www.carloalberto.org/education/allievi-honors-program/",
      "area": "Economics",
      "studyType": "B.Sc. + M.Res.",
      "startDate": "2015-09-01",
      "endDate": "2018-07-01",
      "score": "",
      "courses": [""]
    }
  ],
  "awards": [
    {
      "title": "",
      "date": "",
      "awarder": "",
      "url": "",
      "summary": ""
    }
  ],
  "certificates": [
    {
      "name": "",
      "date": "",
      "issuer": "",
      "url": "",
      "icon": ""
    }
  ],
  "publications": [
    {
      "name": "Zur Elektrody/namik bewegter Körper",
      "publisher": "Annalen der Physik",
      "releaseDate": "1905-06-30",
      "url": "https://en.wikisource.org/wiki/Translation:On_the_Electrodynamics_of_Moving_Bodies",
      "summary": "It concerned an interpretation of the Michelson–Morley experiment and the properties of light and time. Special relativity incorporates the principle that the speed of light is the same for all inertial observers regardless of the state of motion of the source."
    },
    {
      "name": "Über einen die Erzeugung und Verwandlung des Lichtes betreffenden heuristischen Gesichtspunkt",
      "publisher": "Annalen der Physik",
      "releaseDate": "1905-03-18",
      "url": "https://de.wikisource.org/wiki/Über_einen_die_Erzeugung_und_Verwandlung_des_Lichtes_betreffenden_heuristischen_Gesichtspunkt",
      "summary": "In the second paper, he applied the quantum theory to light to explain the photoelectric effect. In particular, he used the idea of light quanta (photons) to explain experimental results, but stressed the importance of the experimental results. The importance of his work on the photoelectric effect earned him the Nobel Prize in Physics in 1921."
    }
  ],
  "skills": [
    {
      "name": "",
      "level": "",
      "icon": "",
      "keywords": []
    }
  ],
  "languages": [
    {
      "language": "German",
      "fluency": "Native speaker",
      "icon": ""
    },
    {
      "language": "English",
      "fluency": "Fluent",
      "icon": ""
    }
  ],
  "interests": [
    {
      "name": "Physics",
      "icon": "fa-solid fa-tag",
      "keywords": [
        "Quantum Mechanics",
        "Quantum Computing",
        "Quantum Information",
        "Quantum Cryptography",
        "Quantum Communication",
        "Quantum Teleportation"
      ]
    }
  ],
  "references": [
    {
      "name": "Professor John Doe",
      "icon": "fa-solid fa-laptop",
      "reference": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam condimentum, diam quis convallis euismod, arcu mi ullamcorper lorem, a vestibulum nunc magna at sem. Sed in risus ac felis varius blandit. D"
    },
    {
      "name": "Professor John Doe",
      "icon": "fa-solid fa-thumbtack",
      "reference": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam condimentum, diam quis convallis euismod, arcu mi ullamcorper lorem, a vestibulum nunc magna at sem. Sed in risus ac felis varius blandit. D"
    }
  ],
  "projects": [
    {
      "name": "Quantum Computing",
      "summary": "Quantum computing is the use of quantum-mechanical phenomena such as superposition and entanglement to perform computation. Computers that perform quantum computations are known as quantum computers.",
      "highlights": ["Quantum Teleportation", "Quantum Cryptography"],
      "startDate": "2018-01-01",
      "endDate": "2018-01-01",
      "url": "https://example.com"
    }
  ]
}

Every project has a beautiful feature showcase page.
It's easy to include images in a flexible 3-column grid format.
Make your photos 1/3, 2/3, or full width.

To give your project a background in the portfolio page, just add the img tag to the front matter like so:

    ---
    layout: page
    title: project
    description: a project with a background image
    img: /assets/img/12.jpg
    ---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/1.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/3.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/5.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Caption photos easily. On the left, a road goes through a tunnel. Middle, leaves artistically fall in a hipster photoshoot. Right, in another hipster photoshoot, a lumberjack grasps a handful of pine needles.
</div>
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/5.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    This image can also have a caption. It's like magic.
</div>

You can also put regular text between your rows of images, even citations {% cite einstein1950meaning %}.
Say you wanted to write a bit about your project before you posted the rest of the images.
You describe how you toiled, sweated, _bled_ for your project, and then... you reveal its glory in the next row of images.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/6.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm-4 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/11.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    You can also have artistically styled 2/3 + 1/3 images, like these.
</div>

The code is simple.
Just wrap your images with `<div class="col-sm">` and place them inside `<div class="row">` (read more about the <a href="https://getbootstrap.com/docs/4.4/layout/grid/">Bootstrap Grid</a> system).
To make images responsive, add `img-fluid` class to each; for rounded corners and shadows use `rounded` and `z-depth-1` classes.
Here's the code for the last row of images above:

{% raw %}

```html
<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/6.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/11.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
```

{% endraw %}


---