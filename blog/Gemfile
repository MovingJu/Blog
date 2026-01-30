source "https://rubygems.org"

Gem::Specification.new do |spec|
  spec.name          = "dev-portfolio-blog"
  spec.version       = "0.1.8"
  spec.authors       = ["Rohit Jain"]
  spec.email         = ["rohitjain18005@gmail.com"]

  spec.summary       = "This is a simple efficient blog and portfolio"
  spec.homepage      = "https://github.com/rohitjain00/dev-portfolio-blog"
  spec.license       = "MIT"

  spec.files = `git ls-files -z`.split("\x0").select do |f|
    f.match(%r!^(blog|assets|_(includes|layouts|sass)/|(LICENSE|README)((\.(txt|md|markdown)|$)))!i)
  end

  spec.add_dependency "jekyll", ">= 4.3", "< 5.0"
  spec.add_runtime_dependency "jekyll-seo-tag"
  spec.add_runtime_dependency "jekyll-feed"
  spec.add_runtime_dependency "jekyll-sitemap"
  spec.add_runtime_dependency "jekyll-paginate-v2"
  spec.add_runtime_dependency "jekyll-minifier"

  spec.add_runtime_dependency "autoprefixer-rails"
  spec.add_runtime_dependency "jemoji"
  spec.add_development_dependency "bundler"
  spec.add_development_dependency "rake"
end

gem "jekyll", "~> 4.3"
gem "jekyll-seo-tag"
gem "jekyll-feed"
gem "jekyll-sitemap"
gem "jekyll-paginate-v2"
gem "jekyll-minifier"
gem "jekyll-assets"
gem "autoprefixer-rails"
gem "jemoji"
gem "rexml"
gem "kramdown", "~> 2.4"
