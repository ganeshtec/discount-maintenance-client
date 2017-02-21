require 'mfa_to_shopper_helper'
require 'pry'


describe 'MFA makes a customer segment discount that is persisted', type: :feature, js: true do
	let(:promotion) do
		Promotion.new(
			name: 			   "Test Promo " + rand(999999999).to_s,	
			promotion_type:    "Amount off individual items",
			redemption_method: "Qualifying Purchases",
			customer_segment:  "Small Roofers",
			inclusion:         "itemssku",
			item_sku:          "100091",
			store_location:    "123",
			rewards_quantity:  "100",
			amount_off:        "99",
			desc_long:         "long description",
			desc_short:        "shorted description",
			start_date:        tomorrow.strftime("%m/%d/%Y"),
			end_date:          tomorrow.strftime("%m/%d/%Y")
			)
	end

	it 'provides the MFA-created customer segment discount to the Promotion_Maintenance_UI' do
		create_cust_segment_discount(promotion)
	end
	
end

def create_cust_segment_discount(promotion)
	sign_in
	expect(page).to have_css('.md-button', text: 'CREATE NEW PROMOTION')
	puts "SIGN IN COMPLETED WITHOUT ERROR"
    
    click_on 'Create New Promotion'
	puts "Create New Promotion SUCCESS" 
	
	fill_in 'name', with: promotion.name
	puts "PROMOTION NAME ADDED SUCCESSFULLY"
	select(promotion.promotion_type, :from => 'promotype')
    puts "PROMOTION Type ADDED SUCCESSFULLY"
	click_button 'Next'
    puts "PROMOTION Next Button on Tab-1"
    
    select(promotion.customer_segment, :from => 'segment')
    puts "PROMOTION Customer Segment ADDED SUCCESSFULLY"

    puts "expect statement SUCCESSFULLY"
    choose("purchaseoption2")
    puts "SELECTED ITEMS/SKUS"

    fill_in 'Search and Add Item Sku Number', with: promotion.item_sku
    puts "PROMOTION inclusion Item Sku After Search"
    click_on 'Search'
    click_button 'Next'
    puts "Location Tab Reached SUCCESSFULLY"


    fill_in 'Search and Add Store Number', with: promotion.store_location
    click_on 'Search'

	puts "Store added SUCCESSFULLY"

    click_button 'Next'

    fill_in 'minamount', with: promotion.rewards_quantity
    puts " Min Quantity added SUCCESSFULLY"
    fill_in 'value', with: promotion.amount_off
	puts " Amount off added SUCCESSFULLY"

    click_button 'Next'

    fill_in 'shortdesc', with: promotion.desc_short
	fill_in 'longdesc', with: promotion.desc_long
	puts " S & L Description added SUCCESSFULLY"
	click_button 'Next'

	click_button 'Next'

	fill_in 'start', with: promotion.start_date 
    fill_in 'end', with: promotion.end_date 
	click_on 'Preview & Submit'
	click_on 'Submit'
	sleep(12)
	puts promotion.name + " Submit process begin"
	expect(page).to have_content promotion.name
	puts "Discount Found on Discount List"
end



