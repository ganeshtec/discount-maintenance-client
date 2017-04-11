require 'mfa_to_shopper_helper'
require 'pry'


describe 'Online makes a customer segment discount that is persisted', type: :feature, js: true do
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
			desc_short:        "short description",
			start_date:        today.strftime("%m/%d/%Y"),
			end_date:          tomorrow.strftime("%m/%d/%Y")
			)
	end

    it 'provides the Online user-created discount to the Promotion_Maintenance_UI for ONLINEUSER' do
		create_discount_online(promotion)
	end	
    it 'edits the Online user-created discount to the Promotion_Maintenance_UI for ONLINEUSER' do
		edit_discount_online()
	end
end

def create_discount_online(promotion)
	puts "Starting test for discount - ONLINE USER"
	online_sign_in
	sleep(2)
	expect(page).to have_css('.md-button', text: 'CREATE NEW PROMOTION')
	puts "SIGN IN COMPLETED WITHOUT ERROR"
    
    click_on 'Create New Promotion'
	puts "Create New Promotion SUCCESS" 
	
	fill_in 'name', with: promotion.name
	select(promotion.promotion_type, :from => 'promotype')
    click_button 'Next'
    
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
	sleep(10)
	puts promotion.name + " Submit process begins for Online User"
	page.has_content?(promotion.name)
	puts promotion.name + " Submit process ends for Online User"
	sleep(12)
end

def edit_discount_online()
	edited_promo_name = "EDITED Test Promo " + rand(999999999).to_s
	puts "Editing for discount - ONLINE USER"
	online_sign_in
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

	puts "Descriptions page"
    click_button 'Next'

	puts "Redemption limits page"
    click_button 'Next'

	fill_in 'start', with: promotion.start_date 
    fill_in 'end', with: promotion.end_date 
	sleep(10)
	click_on 'Preview & Submit'
	sleep(10)
	click_on 'Submit'
	
	puts edited_promo_name + " Submit process begins for Online User"
	page.has_content?(edited_promo_name)
	puts edited_promo_name + " Submit process ends for Online User"	

	sleep(12)
end