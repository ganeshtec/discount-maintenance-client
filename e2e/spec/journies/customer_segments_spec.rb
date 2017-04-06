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

    it 'provides the MFA-created customer segment discount to the Promotion_Maintenance_UI for STOREUSER' do
		create_cust_segment_discount_store(promotion)
	end
	
	it 'provides the MFA-created customer segment discount to the Promotion_Maintenance_UI for ONLINEUSER' do
		create_cust_segment_discount_online(promotion)
	end

	# it 'edits the MFA-created customer segment discount to the Promotion_Maintenance_UI for ONLINEUSER' do
	# 	edit_cust_segment_discount()
	# end
	
	
end

def create_cust_segment_discount_store(promotion)
	store_sign_in
	expect(page).to have_css('.md-button', text: 'CREATE NEW PROMOTION')
	puts "SIGN IN COMPLETED WITHOUT ERROR"
    
    click_on 'Create New Promotion'
	puts "Create New Promotion SUCCESS" 
	
	fill_in 'name', with: promotion.name
	select('Customer Segmentation', :from => 'promotype')
    click_button 'Next'
    
    select('Small Roofers', :from => 'segment')
    puts "PROMOTION Customer Segment ADDED SUCCESSFULLY"

    puts "expect statement SUCCESSFULLY"
    choose("purchaseoption2")
    
	
    fill_in 'Search and Add Item Sku Number', with: promotion.item_sku
    puts "PROMOTION inclusion Item Sku After Search"
    click_on 'Search'
    click_button 'Next'
 
    fill_in 'Search and Add Store Number', with: promotion.store_location
    click_on 'Search'

	click_button 'Next'

    fill_in 'minamount', with: promotion.rewards_quantity
    fill_in 'value', with: promotion.amount_off
	click_button 'Next'

    # ----------------------------
	# This was removed along with the "Descriptions" tab
    # fill_in 'shortdesc', with: promotion.desc_short
	# fill_in 'longdesc', with: promotion.desc_long
	# puts " S & L Description added SUCCESSFULLY"
	# click_button 'Next'

	# This was removed along with the "Redemption Limits" tab
	# click_button 'Next'
	# ----------------------------

	fill_in 'start', with: promotion.start_date 
    fill_in 'end', with: promotion.end_date 
	click_on 'Preview & Submit'
	click_on 'Submit'
	sleep(12)
	puts promotion.name + " Submit process begins for Store User"
	# expect(page).to have_content promotion.name
	page.has_content?(promotion.name)
	puts promotion.name + " Submit process ends for Store User"	
end

 def create_cust_segment_discount_online(promotion)
	online_sign_in
	sleep(2)
	expect(page).to have_css('.md-button', text: 'CREATE NEW PROMOTION')
	puts "SIGN IN COMPLETED WITHOUT ERROR"
    
    click_on 'Create New Promotion'
	puts "Create New Promotion SUCCESS" 
	
	fill_in 'name', with: promotion.name
	select(promotion.promotion_type, :from => 'promotype')
    click_button 'Next'
    
    # ----------------------------
	# Removed bc doesn't pertain to online user
    # select(promotion.customer_segment, :from => 'segment'
	# ----------------------------

    choose("purchaseoption2")
    fill_in 'Search and Add Item Sku Number', with: promotion.item_sku
    click_on 'Search'
    click_button 'Next'
    
    fill_in 'Search and Add Store Number', with: promotion.store_location
    click_on 'Search'

	click_button 'Next'

    fill_in 'minamount', with: promotion.rewards_quantity
    fill_in 'value', with: promotion.amount_off
	
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
	puts promotion.name + " Submit process begins for Online User"
	page.has_content?(promotion.name)
	puts promotion.name + " Submit process ends for Online User"
end

def edit_cust_segment_discount()
	online_sign_in
	
	page.find('tr', :text => 'Active', :match => :first)
	within('tr', :text => 'Active', :match => :first) do
	find('md-checkbox').click
	puts "Checked Active Promotion checkbox"
	end
	expect(page).to have_css('.md-button', text: 'Edit')
	puts "Edit Button Found::"
	click_on 'Edit'
	puts "Edit Button Clicked::"
	sleep(5)

	fill_in 'name', with: promotion.name
	select(promotion.promotion_type, :from => 'promotype')
    click_button 'Next'
    select(promotion.customer_segment, :from => 'segment')
    

    choose("purchaseoption2")
    
    fill_in 'Search and Add Item Sku Number', with: promotion.item_sku
    click_on 'Search'
    click_button 'Next'

    fill_in 'Search and Add Store Number', with: promotion.store_location
    click_on 'Search'

    click_button 'Next'

    fill_in 'minamount', with: promotion.rewards_quantity
    fill_in 'value', with: promotion.amount_off
	

    click_button 'Next'

    fill_in 'shortdesc', with: promotion.desc_short
	fill_in 'longdesc', with: promotion.desc_long
	
	click_button 'Next'
	click_button 'Next'

	fill_in 'start', with: promotion.start_date 
    fill_in 'end', with: promotion.end_date 
	click_on 'Preview & Submit'
	click_on 'Submit'
	puts promotion.name + " Successfully Edited for Online User"
	expect(page).to have_content promotion.name
	puts "Discount Found on Discount List"
	sleep(12)

end