FROM ruby:3.2.10-slim-bookworm

RUN apt-get update -qq && apt-get install -y build-essential git
RUN gem install bundler jekyll rexml

WORKDIR /srv/jekyll

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]
