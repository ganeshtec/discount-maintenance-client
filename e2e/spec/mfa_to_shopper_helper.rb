require 'capybara/rspec'
require 'capybara-webkit'
require 'capybara-screenshot/rspec'
require 'selenium-webdriver'
require 'securerandom'
require 'httparty'
require 'json'
require 'pry'


Capybara.configure do |config|
  config.run_server = false
  config.javascript_driver = :selenium
end

Capybara.default_wait_time = 12

Capybara.register_driver :selenium do |app|
    Capybara::Selenium::Driver.new(app, :browser => :chrome)
end

Capybara.save_path = "/tmp/screenshots"

Capybara::Screenshot.prune_strategy = :keep_last_run

Capybara::Webkit.configure(&:allow_unknown_urls)

PROMO_UI_HOST = ENV['PROMO_UI_HOST'] || 'http://localhost.homedepot.com:8002'.freeze
PROMO_CREATION = ENV['PROMO_CREATION'] || 'http://localhost.homedepot.com:8002/#/promotion-admin'.freeze

def future_date(days_ahead)
  todays_date = Date.today
  (todays_date + days_ahead)
end

def today
  future_date(0)
end

def tomorrow
  future_date(1)
end

def online_sign_in
  visit "#{PROMO_UI_HOST}"
  if page.has_content? 'Please provide a valid user name and password.'
    fill_in 'j_username', with: ENV['ONLINE_USER_ID']
    fill_in 'j_password', with: ENV['ONLINE_USER_PASSWORD']
    #binding.pry
    click_on 'Sign In'
  end
end

def store_sign_in
  visit "#{PROMO_UI_HOST}"
  if page.has_content? 'Please provide a valid user name and password.'
    fill_in 'j_username', with: ENV['STORE_USER_ID']
    fill_in 'j_password', with: ENV['STORE_USER_PASSWORD']
    #binding.pry
    click_on 'Sign In'
  end
end

class Promotion
  attr_reader :name, :promotion_type, :redemption_method, :customer_segment, :priority, :inclusion, :item_sku, :market_location, :rewards_quantity, 
  :amount_off, :desc_long, :desc_short, :start_date, :end_date

  def initialize(name:, promotion_type:, redemption_method:, customer_segment:, priority:, inclusion:, item_sku:, market_location:, rewards_quantity:, 
    amount_off:, desc_long:, desc_short:, start_date:, end_date:)
    @name = name
    @promotion_type = promotion_type
    @redemption_method = redemption_method
    @customer_segment = customer_segment
    @priority = priority
    @inclusion = inclusion
    @item_sku = item_sku
    @market_location = market_location
    @rewards_quantity = rewards_quantity
    @amount_off = amount_off
    @desc_long = desc_long
    @desc_short = desc_short
    @start_date = start_date
    @end_date = end_date
  end
end
