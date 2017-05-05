require 'mfa_to_shopper_helper'
require 'pry'


describe 'MFA makes a customer segment discount that is persisted', type: :feature, js: true do
	let(:promotion) do
		Promotion.new(
			name: 			   "Test Promo " + rand(999999999).to_s,	
			promotion_type:    "Amount off individual items",
			redemption_method: "Qualifying Purchases",
			customer_segment:  "Roofing Pantry Loaders",
			inclusion:         "itemssku",
			priority:		   "10",
			item_sku:          "100091",
			market_location:    "1",
			rewards_quantity:  "100",
			amount_off:        "99",
			desc_long:         "long description",
			desc_short:        "short description",
			start_date:        today.strftime("%m/%d/%Y"),
			end_date:          tomorrow.strftime("%m/%d/%Y")
			)
	end

    it 'provides the MFA-created customer segment discount to the Promotion_Maintenance_UI for STOREUSER' do
		create_cust_segment_discount_store(promotion)
	end

	it 'edits the MFA-created customer segment discount to the Promotion_Maintenance_UI for STOREUSER' do
		edit_cust_segment_discount_store()
	end	

	it 'edits the MFA-created multi-sku bulk discount to the Promotion_Maintenance_UI for STOREUSER' do
		edit_MSB_discount_store()
	end
end

def create_cust_segment_discount_store(promotion)
	puts "Starting test for discount - STORE USER"
	store_sign_in
	expect(page).to have_css('.md-button', text: 'CREATE NEW PROMOTION')
	puts "SIGN IN COMPLETED WITHOUT ERROR"
    
    click_on 'Create New Promotion'
	puts "Create New Promotion SUCCESS" 
	
	fill_in 'name', with: promotion.name
	sleep(5)
	select('Customer Segmentation', :from => 'promotype')
	
	fill_in 'priority', with: promotion.priority

    click_button 'Next'

    select('Small Roofers', :from => 'segment')
    puts "PROMOTION Customer Segment ADDED SUCCESSFULLY"

    puts "expect statement SUCCESSFULLY"
    choose("purchaseoption2")

	
	
    fill_in 'Search and Add Item Sku Number', with: promotion.item_sku
    puts "PROMOTION inclusion Item Sku After Search"
    click_on 'Search'
    click_button 'Next'
 
    fill_in 'Search and Add Market Number', with: promotion.market_location
    click_on 'Search'

	click_button 'Next'

    fill_in 'minamount', with: promotion.rewards_quantity
    fill_in 'value', with: promotion.amount_off
	click_button 'Next'

	fill_in 'start', with: promotion.start_date 
    fill_in 'end', with: promotion.end_date 
	sleep(10)
	click_on 'Preview & Submit'
	sleep(5)
	click_on 'Submit'
	sleep(12)
	puts promotion.name + " Submit process begins for Store User"
	page.has_content?(promotion.name)
	puts promotion.name + " Submit process ends for Store User"
	sleep(12)
end

def edit_cust_segment_discount_store()
	edited_promo_name = "EDITED Test Promo " + rand(999999999).to_s
	puts "Editing for discount - STORE USER"
	store_sign_in
	sleep(5)
	page.find('tr', :text => 'Active', :match => :first)
	within('tr', :text => 'Active', :match => :first) do
	find('md-checkbox').click
	puts "Checked Active Promotion checkbox"
	end
	expect(page).to have_css('.md-button', text: 'Edit')
	puts "Edit Button Found::"
	click_on 'Edit'
	puts "Edit Button Clicked::"

	puts "Properties page"
	fill_in 'name', with: edited_promo_name
    click_button 'Next'

    choose("purchaseoption2")

	puts "Purchase Conditions page"
    click_button 'Next'

	puts "Location page"
    click_button 'Next'

    fill_in 'minamount', with: promotion.rewards_quantity
    fill_in 'value', with: promotion.amount_off
	
	puts "Rewards page"
    click_button 'Next'

	# fill_in 'start', with: promotion.start_date 
    # fill_in 'end', with: promotion.end_date 
	sleep(3)
	click_on 'Preview & Submit'
	sleep(3)
	click_on 'Submit'
	
	puts edited_promo_name + " Submit process begins for Store User"
	page.has_content?(edited_promo_name)
	puts edited_promo_name + " Submit process ends for Store User"	
	sleep(12)
end

def edit_MSB_discount_store()
	edited_promo_name = "EDITED Test Promo " + rand(999999999).to_s
	puts "Editing to change customer segment discount to MSB disocunt - STORE USER"
	store_sign_in
	sleep(5)
	page.find('tr', :text => 'Active', :match => :first)
	within('tr', :text => 'Active', :match => :first) do
	find('md-checkbox').click
	puts "Checked Active Promotion checkbox"
	end
	expect(page).to have_css('.md-button', text: 'Edit')
	puts "Edit Button Found::"
	click_on 'Edit'
	puts "Edit Button Clicked::"

	puts "Properties page"
	fill_in 'name', with: edited_promo_name
	sleep(5)
	select('Multi-SKU Bulk', :from => 'promotype')
    click_button 'Next'

    choose("purchaseoption2")

	puts "Purchase Conditions page"
    click_button 'Next'

	puts "Location page"
    click_button 'Next'

    fill_in 'minamount', with: promotion.rewards_quantity
    fill_in 'value', with: promotion.amount_off
	
	puts "Rewards page"
    click_button 'Next'

	fill_in 'start', with: promotion.start_date 
    fill_in 'end', with: promotion.end_date 
	sleep(3)
	click_on 'Preview & Submit'
	sleep(3)
	click_on 'Submit'
	
	puts edited_promo_name + " Submit process begins for Store User"
	page.has_content?(edited_promo_name)
	puts edited_promo_name + " Submit process ends for Store User"	
	sleep(12)
end