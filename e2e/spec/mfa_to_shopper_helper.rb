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

#Capybara.default_wait_time = 12
Capybara.default_max_wait_time = 20
Capybara.register_driver :selenium do |app|
    Capybara::Selenium::Driver.new(app, :browser => :chrome)
end

Capybara.save_path = "/tmp/screenshots"

Capybara::Screenshot.prune_strategy = :keep_last_run

Capybara::Webkit.configure(&:allow_unknown_urls)

PROMO_UI_HOST = ENV['PROMO_UI_HOST'] || 'http://localhost.homedepot.com:8002'.freeze
PROMO_CREATION = ENV['PROMO_CREATION'] || 'http://localhost.homedepot.com:8002/#/promotion-admin'.freeze
DISC_MAINT_API = ENV['DISC_MAINT_API'] || 'http://localhost.homedepot.com:8090/v1'.freeze

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

#Continue to work on wednesday
def validate_values_in_database(promotion_id,promotion)

 http_response = HTTParty.get("#{DISC_MAINT_API}" + "/cartPromotions/" + promotion_id)
  expect(http_response.code).to be(200)

  response = JSON.parse(http_response.body)

  # expected_start_date = Date.strptime(promotion.start_date, "%m/%d/%Y").strftime("%Y-%m-%d")
  # expected_end_date = Date.strptime(promotion.end_date, "%m/%d/%Y").strftime("%Y-%m-%d")
  # expected_sku_list = promotion.item_sku.split(",").reverse.join(",")
  # #expected_store_list = promotion.store_location.split(",").reverse.join(",")
  # expect(discount[0]["promoId"].to_s).to eq(promotion_id)
  # expect(discount[0]["startDate"]).to eq(expected_start_date)
  # expect(discount[0]["endDate"]).to eq(expected_end_date)
  # expect(discount[0]["threshold"]).to eq(promotion.quantity.to_i)
  # expect(discount[0]["skuList"]).to eq(expected_sku_list)
  # expect(discount[0]["amount"]).to eq(promotion.percent_off.to_i)
  # #expect(discount[0]["storeList"]).to eq(expected_store_list)
  puts "MSB Promotion exists in the discount admin API and its promotion ID is: " + response


end


class Promotion
  attr_reader :name, :promotion_type, :redemption_method, :customer_segment, :priority, :inclusion, :item_sku, :market_location, :rewards_quantity, 
  :percent_off, :desc_long, :desc_short, :start_date, :end_date

  def initialize(name:, promotion_type:, redemption_method:, customer_segment:, priority:, inclusion:, item_sku:, market_location:, rewards_quantity:, 
    percent_off:, desc_long:, desc_short:, start_date:, end_date:)
    @name = name
    @promotion_type = promotion_type
    @redemption_method = redemption_method
    @customer_segment = customer_segment
    @priority = priority
    @inclusion = inclusion
    @item_sku = item_sku
    @market_location = market_location
    @rewards_quantity = rewards_quantity
    @percent_off = percent_off
    @desc_long = desc_long
    @desc_short = desc_short
    @start_date = start_date
    @end_date = end_date
  end
end
