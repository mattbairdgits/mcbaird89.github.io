{InputLayer} = require "input"
input_firstName = InputLayer.wrap(input_firstName_bg, input_firstName_text)
input_lastName = InputLayer.wrap(input_lastName_bg, input_lastName_text)

Framer.Extras.Hints.disable()

flow = new FlowComponent
Canvas.backgroundColor = "#F2F2F2"
flow.backgroundColor = "#FFFFFF"

extra_deets.opacity = 0
add_preferences_title.opacity = 0
open_button.opacity = 0
open_button.scale = 0.6
password_dots.opacity = 0
password_dots_1.opacity = 0

number_of_preferences = 0

flow.showNext(appStore_search, animate: true)

# App Store Interactions
get_button.onTouchStart ->
	get_button.animate
		backgroundColor: "#C9C8CF"
		options:
			time: 0.1
get_button.onTap ->
	get_button.animate
		backgroundColor: "#F0F1F6"
		opacity: 0
		scale: 0.6
		options:
			time: 0.2
	downloading.animate
		borderColor: "#017AFF"
		backgroundColor: "#E5F2FF"
		options:
			time: 2
	Utils.delay 3, ->
		downloading.animate
			opacity: 0
			scale: 0.6
			options:
				time: 0.2
		open_button.bringToFront()
		open_button.animate
			opacity: 1
			scale: 1
			options:
				time: 0.2

open_button.onTap ->
	flow.showNext(splash, animate: true)
	Utils.delay 2, ->
		flow.showNext(location_screen, animate: true)


understood_button.onTap ->
	flow.showOverlayCenter(location_alert, modal: true)

yes_location.onTap ->
	flow.showPrevious()
	
	Utils.delay 0.5, ->
		flow.showOverlayCenter(notifications_alert, modal: true)

yes_notif.onTap ->
	flow.showPrevious()
	
	Utils.delay 0.5, ->
		flow.showNext(pref_screen2, animate: true)
		
		# So transition is fluid, real sticky elements appear after page is in
		Utils.delay 0.6, ->
			flow.header = title_bar 
			flow.footer = add_preferences_sticky
			title_bar_fake.opacity = 0
			add_preferences_sticky_fake.opacity = 0
		
		# I don't know why I had to do this
		flow.scroll.contentInset =
			top: 0
	
		# Title scroll interaction
		flow.scroll.onMove (event) ->
			add_preferences_title.opacity = Utils.modulate(event.y, [-30,-60], [0, 1], true)
	
# Preference onTap Interactions
pills = [dietary, dietary_1, dietary_2, dietary_3, dietary_4, dietary_5, dietary_6, lifestyle_pill, lifestyle_pill_1, lifestyle_pill_2, lifestyle_pill_3, accessibility, accessibility_1]

bubbles = [food_drink, food_drink_1, food_drink_2, food_drink_3, food_drink_4, food_drink_5, food_drink_6, food_drink_7, food_drink_8, food_drink_9, food_drink_10, food_drink_11, food_drink_12, food_drink_13, food_drink_14, food_drink_15, food_drink_16, food_drink_17, food_drink_18, food_drink_19, food_drink_20, food_drink_21, food_drink_22, food_drink_23, food_drink_24, food_drink_25, food_drink_26, food_drink_27, food_drink_28, food_drink_29, food_drink_30, food_drink_31, food_drink_32, food_drink_33, food_drink_34, food_drink_35, food_drink_36, food_drink_37, food_drink_38, food_drink_39, food_drink_40, food_drink_41, food_drink_42, food_drink_43, food_drink_44, food_drink_45, food_drink_46, food_drink_47, food_drink_48, food_drink_49, food_drink_50, food_drink_51, toDo, toDo_1, toDo_2, toDo_3, toDo_4, toDo_5, toDo_6, toDo_7, lifestyle, lifestyle_1, lifestyle_2, lifestyle_3, lifestyle_4, lifestyle_5, lifestyle_6, lifestyle_7, lifestyle_8, lifestyle_9, lifestyle_10]

# Pills Active & Inactive states
for number, pill of pills
	pill.states =
		active:
			backgroundColor: "#0097EC"
			borderWidth: 0
			animationOptions:
				time: 0.1
		inactive:
			backgroundColor: "#FFFFFF"
			borderWidth: 1
			animationOptions:
				time: 0.1
	if number > 0
		pill.subLayers[0].states =
			active:
				color: "#FFFFFF"
				animationOptions:
					time: 0.1
			inactive:
				color: "#666666"
				animationOptions:
					time: 0.1

# Bubbles Active & Inactive states
for bubble in bubbles
	bubble.subLayers[0].states =
		active:
			backgroundColor: "#D23232"
			animationOptions:
				time: 0.1
		inactive:
			backgroundColor: "#FFFFFF"
			animationOptions:
				time: 0.1
		
	bubble.subLayers[1].states =
		active:
			fill: "#FFFFFF"
			animationOptions:
				time: 0.1
		inactive:
			fill: "#CCCCCC"
			animationOptions:
				time: 0.1


# Special boi
veggie_text.states =
	active:
		color: "#FFFFFF"
		animationOptions:
			time: 0.1
	inactive:
		color: "#666666"
		animationOptions:
			time: 0.1
veggie_leaf.states =
	active:
		fill: "#FFFFFF"
		animationOptions:
			time: 0.1
	inactive:
		fill: "#41A700"
		animationOptions:
			time: 0.1


for number, pill of pills
	if number < 1
		pill.onTap ->
			veggie_text.stateCycle("active", "inactive")
			veggie_leaf.animate
				y: 10
				options:
					curve: Bezier.easeOut
					time: 0.2
			veggie_leaf.onAnimationEnd ->
				this.animate
					y: 11
					options:
						curve: Spring(damping: 0.3)
						time: 0.5
	pill.onTap ->
		this.subLayers[0].stateCycle("active", "inactive")
		this.stateCycle("active", "inactive")
		
		if this.states.current.name == "active"
			number_of_preferences++
		if this.states.current.name == "inactive"
			number_of_preferences--
		
		if number_of_preferences == 0
			add_preferences_button.backgroundColor = "rgba(0,151,236,0.3)"
			add_preferences_button_text.text = "Add Preferences"
		
		if number_of_preferences >= 1
			add_preferences_button.backgroundColor = "rgba(0,151,236,1)"
			add_preferences_button_text.text = "Add Preferences (" + number_of_preferences + ")"

for bubble in bubbles
	bubble.onTap ->
		this.subLayers[0].stateCycle("active", "inactive")
		this.subLayers[1].stateCycle("active", "inactive")
		
		this.subLayers[1].animate
			y: 10
			options:
				curve: Bezier.easeOut
				time: 0.2
		this.subLayers[1].onAnimationEnd ->
			this.animate
				y: 11
				options:
					curve: Spring(damping: 0.3)
					time: 0.5
		if this.subLayers[1].states.current.name == "active"
			number_of_preferences++
		if this.subLayers[1].states.current.name == "inactive"
			number_of_preferences--
		
		if number_of_preferences == 0
			add_preferences_button.backgroundColor = "rgba(0,151,236,0.3)"
			add_preferences_button_text.text = "Add Preferences"
		
		if number_of_preferences >= 1
			add_preferences_button.backgroundColor = "rgba(0,151,236,1)"
			add_preferences_button_text.text = "Add Preferences (" + number_of_preferences + ")"

# "See More" Interactions
expand_links = [food_drink_expand, toDo_expand, lifestyle_expand]
sections = [food_drink_section, toDo_section, lifestyle_section]
mores = [more_food_drink, more_ttd, more_lifestyle]
sectionOffsetY = 72

for i in [0...expand_links.length]
	mores[i].opacity = 0

expand_section = (nb) ->
	expand_links[nb].onTap ->
		this.opacity = 0 # hide link
		if mores[nb].opacity is 0
			parentLayer = pref_screen2.children[1].children[0].children[0]
			parentLayer.height += mores[nb].height - sectionOffsetY
			
			mores[nb].parent = sections[nb]
			mores[nb].animate
				opacity: 1
				options:
					time: 0.2
			mores[nb].x = 0
			mores[nb].y = sections[nb].height - sectionOffsetY
			sections[nb].height += mores[nb].height - sectionOffsetY
			
			if (nb==0)
				sections[nb+1].y = sections[nb].y + sections[nb].height
				sections[nb+2].y = sections[nb+1].y + sections[nb+1].height
			if (nb==1)
				sections[nb+1].y = sections[nb].y + sections[nb].height
			
			flow.scroll.updateContent()

	
for i in [0...expand_links.length]
	expand_section i

add_preferences_button.onTap ->
	if number_of_preferences >= 1
		flow.showNext(signup_screen, animate: true)
		flow.header.destroy()
		flow.footer.destroy()
		title_bar_fake.opacity = 1
		add_preferences_sticky_fake.opacity = 1

email_signup.onTap ->
	flow.showNext(email_signup_screen, animate: true)

# Email Signup Page
input_firstName.onValueChange ->
	welcome_title.text = "Welcome to Yelp, " + input_firstName.value

input_password_bg.onTap ->
	for inputElement in document.querySelectorAll('input')
		inputElement.blur()
	flow.y = 0
	email_signup_screen.y = 0
	input_password_text.animate
		opacity: 0
		options:
			time: 0.1
	input_email_text.animate
		opacity: 0
		options:
			time: 0.1
	password_dots.animate
		opacity: 1
		options:
			time: 0.3
	password_dots_1.animate
		opacity: 1
		options:
			time: 0.3
	next_text.opacity = 1

next_button.onTap ->
	document.querySelector('input').blur()
	flow.showNext(extra_deets_screen, animate: true)

# Extra Details and Home Screen Loading/Shimmer
shimmer_lights = [shimmer_light, shimmer_light_1, shimmer_light_2]
for shimmery in shimmer_lights
	shimmery.x = -shimmery.width

shimmer_boxes = [shimmer_box, shimmer_box_1, shimmer_box_3]
statusBarBG.opacity = 0


extra_deets.onTap ->
	extra_deets.animate
		opacity: 1
		options:
			time: 2
sign_up_text.onTap ->
	flow.showNext(home_screen, animate: true)
	Utils.delay 0.1, ->
		flow.scroll.contentInset =
			top: 0
		if flow.current.name is "home_screen"
			home_header.parent = flow
			home_header.bringToFront()
			home_header.x = 0
			home_footer.parent = flow
			home_footer.bringToFront()
			home_footer.x = 0
			for shimmery in shimmer_lights
				shimmery.animate
					x: 374
					options:
						time: 1.4
						delay: 1
						repeat: 2
						curve: Bezier.easeOut
			Utils.delay 0.7, ->
				flow.showOverlayCenter(configuring_tile_signedUp, modal: true)
			Utils.delay 5, ->
				flow.showPrevious()
				for shimmerers in shimmer_boxes
					shimmerers.animate
						opacity: 0
						options:
							time: 0.2
sign_up_button.onTap ->
	flow.showNext(home_screen, animate: true)
	Utils.delay 0.1, ->
		flow.scroll.contentInset =
			top: 0
		if flow.current.name is "home_screen"
			home_header.parent = flow
			home_header.bringToFront()
			home_header.x = 0
			home_footer.parent = flow
			home_footer.bringToFront()
			home_footer.x = 0
			for shimmery in shimmer_lights
				shimmery.animate
					x: 374
					options:
						time: 1.4
						delay: 1
						repeat: 2
						curve: Bezier.easeOut
			Utils.delay 0.7, ->
				flow.showOverlayCenter(configuring_tile_signedUp, modal: true)
			Utils.delay 5, ->
				flow.showPrevious()
				for shimmerers in shimmer_boxes
					shimmerers.animate
						opacity: 0
						options:
							time: 0.2
