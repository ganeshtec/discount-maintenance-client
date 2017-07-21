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
			item_sku:          "100049,100090,100091",
			market_location:    "1",
			#store_location:	"0121,0123",
			store_location:		"",
			rewards_quantity:  "100",
			percent_off:        "9",
			desc_long:         "long description",
			desc_short:        "short description",
			start_date:        today.strftime("%m/%d/%Y"),
			end_date:          future_date(7).strftime("%m/%d/%Y")
			)
	end

    it 'provides the MFA-created customer segment discount to the Promotion_Maintenance_UI for STOREUSER' do
		#promotion_id = create_cust_segment_discount_store(promotion)
		promotion_id =	create_MSB_discount_market(promotion)
 		validate_values_in_database(promotion_id,promotion)
	end

	# it 'edits the MFA-created customer segment discount to the Promotion_Maintenance_UI for STOREUSER' do
	# 	edit_cust_segment_discount_store()
	# end	

	# it 'edits the MFA-created multi-sku bulk discount to the Promotion_Maintenance_UI for STOREUSER' do
	# 	edit_MSB_discount_store()
	# end
end

def create_MSB_discount_store(promotion) 
		puts "Creating MSB  discount for - STORE USER"
		store_sign_in
		expect(page).to have_css('.md-button', text: 'CREATE NEW DISCOUNT')
		puts "SIGN IN COMPLETED WITHOUT ERROR"
		click_on 'Create New Discount'
		puts "Found Create New Discount and Clicked " 
		fill_in 'name', with: promotion.name
		sleep(5)
		select('Multi-SKU Bulk', :from => 'promotype')
		fill_in 'priority', with: promotion.priority
		click_button 'Next'
		#choose("purchaseoption2")
		find_field("itemssku_0", :visible => false).click

		fill_in 'Search and Add Item Sku Number', with: promotion.item_sku
		click_on 'Search'
		sleep(5)
		expect(page).to have_content("Filter SKU Types")
		click_on 'Apply'
		puts "Purchase Conditions Option Selected Successfully"
		click_button 'Next'
		choose("stores", visible: false)

		fill_in 'Search and Add Store Number', with: promotion.store_location
		click_on 'Search'
		puts "Location page Market Numbers Entered Successfully"
		click_button 'Next'
		
		fill_in 'minamount', with: promotion.rewards_quantity
		fill_in 'value', with: promotion.percent_off
		click_button 'Next'
		fill_in 'start', with: promotion.start_date 
		fill_in 'end', with: promotion.end_date 
		sleep(10)
		click_on 'Preview & Submit'
		sleep(5)
		click_on 'Submit'
		sleep(12)
		puts promotion.name + " Submit process begins for Store User MSB Discount"
		page.has_content?(promotion.name)
		puts promotion.name + " Submit process ends for Store User"
		sleep(12)
		promotion_id = first('td.dashboard-promo-id').text
		return promotion_id
end

def create_MSB_discount_market(promotion) 
		puts "Creating MSB  discount for - STORE USER"
		store_sign_in
		expect(page).to have_css('.md-button', text: 'CREATE NEW DISCOUNT')
		puts "SIGN IN COMPLETED WITHOUT ERROR"
		click_on 'Create New Discount'
		puts "Found Create New Discount and Clicked " 
		fill_in 'name', with: promotion.name
		sleep(5)
		select('Multi-SKU Bulk', :from => 'promotype')
		fill_in 'priority', with: promotion.priority
		click_button 'Next'
		#choose("itemssku_0")
		find_field("itemssku_0", :visible => false).click
		fill_in 'Search and Add Item Sku Number', with: promotion.item_sku
		click_on 'Search'
		sleep(5)
		expect(page).to have_content("Filter SKU Types")
		click_on 'Apply'
		puts "Purchase Conditions Option Selected Successfully"
		click_button 'Next'
		choose("markets", visible: false)

		fill_in 'Search and Add Market Number', with: promotion.market_location
		click_on 'Search'
		puts "Location page Market Numbers Entered Successfully"
		click_button 'Next'
		
		fill_in 'minamount', with: promotion.rewards_quantity
		fill_in 'value', with: promotion.percent_off
		click_button 'Next'
		fill_in 'start', with: promotion.start_date 
		fill_in 'end', with: promotion.end_date 
		sleep(10)
		click_on 'Preview & Submit'
		sleep(5)
		click_on 'Submit'
		sleep(12)
		puts promotion.name + " Submit process begins for Store User MSB Discount"
		page.has_content?(promotion.name)
		puts promotion.name + " Submit process ends for Store User"
		sleep(12)
		promotion_id = first('td.dashboard-promo-id').text
		return promotion_id
end

# def create_cust_segment_discount_store(promotion)
# 	puts "Starting test for discount - STORE USER"
# 	store_sign_in
# 	expect(page).to have_css('.md-button', text: 'CREATE NEW DISCOUNT')
# 	puts "SIGN IN COMPLETED WITHOUT ERROR"
    
#     click_on 'Create New Discount'
# 	puts "Create New Discount SUCCESS" 
	
# 	fill_in 'name', with: promotion.name
# 	sleep(5)
# 	select('Customer Segmentation', :from => 'promotype')
	
# 	fill_in 'priority', with: promotion.priority

#     click_button 'Next'

#     select('bbb', :from => 'segment')
#     puts "PROMOTION Customer Segment ADDED SUCCESSFULLY"

#     puts "expect statement SUCCESSFULLY"
#     choose("purchaseoption2")

	
	
#     fill_in 'Search and Add Item Sku Number', with: promotion.item_sku
#     puts "PROMOTION inclusion Item Sku After Search"
#     click_on 'Search'
# 	click_on 'Apply'
#     click_button 'Next'
 
#     fill_in 'Search and Add Market Number', with: promotion.market_location
#     click_on 'Search'

# 	click_button 'Next'

#     fill_in 'minamount', with: promotion.rewards_quantity
#     fill_in 'value', with: promotion.percent_off
# 	click_button 'Next'

# 	fill_in 'start', with: promotion.start_date 
#     fill_in 'end', with: promotion.end_date 
# 	sleep(10)
# 	click_on 'Preview & Submit'
# 	sleep(5)
# 	click_on 'Submit'
# 	sleep(12)
# 	puts promotion.name + " Submit process begins for Store User"
# 	page.has_content?(promotion.name)
# 	puts promotion.name + " Submit process ends for Store User"
# 	sleep(12)
# 	promotion_id = first('td.dashboard-promo-id').text
# 	return promotion_id
# end

# def edit_cust_segment_discount_store()
# 	edited_promo_name = "EDITED Test Promo " + rand(999999999).to_s
# 	puts "Editing for discount - STORE USER"
# 	store_sign_in
# 	sleep(5)
# 	page.find('tr', :text => 'Active', :match => :first)
# 	within('tr', :text => 'Active', :match => :first) do
# 	find('md-checkbox').click
# 	puts "Checked Active Promotion checkbox"
# 	end
# 	expect(page).to have_css('.md-button', text: 'Edit')
# 	puts "Edit Button Found::"
# 	click_on 'Edit'
# 	puts "Edit Button Clicked::"

# 	puts "Properties page"
# 	fill_in 'name', with: edited_promo_name
#     click_button 'Next'

#     choose("purchaseoption2")

# 	puts "Purchase Conditions page"
#     click_button 'Next'

# 	puts "Location page"
#     click_button 'Next'

#     fill_in 'minamount', with: promotion.rewards_quantity
#     fill_in 'value', with: promotion.percent_off
	
# 	puts "Rewards page"
#     click_button 'Next'

# 	# fill_in 'start', with: promotion.start_date 
#     # fill_in 'end', with: promotion.end_date 
# 	sleep(3)
# 	click_on 'Preview & Submit'
# 	sleep(3)
# 	click_on 'Submit'
	
# 	puts edited_promo_name + " Submit process begins for Store User"
# 	page.has_content?(edited_promo_name)
# 	puts edited_promo_name + " Submit process ends for Store User"	
# 	sleep(12)
# end

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

	find_field("itemssku_0", :visible => false).click

	puts "Purchase Conditions page"
    click_button 'Next'

	puts "Location page"
    click_button 'Next'

    fill_in 'minamount', with: promotion.rewards_quantity
    fill_in 'value', with: promotion.percent_off
	
	puts "Rewards page"
    click_button 'Next'

	# fill_in 'start', with: promotion.start_date 
    fill_in 'end', with: future_date(5).strftime("%m/%d/%Y") 
	sleep(3)
	click_on 'Preview & Submit'
	sleep(3)
	click_on 'Submit'
	
	puts edited_promo_name + " Submit process begins for Store User"
	page.has_content?(edited_promo_name)
	puts edited_promo_name + " Submit process ends for Store User"	
	sleep(12)
end


