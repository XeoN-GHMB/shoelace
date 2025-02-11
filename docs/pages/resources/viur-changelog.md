# Changelog
## 1.0.10
- feat: Carousels now reset their timer while sliding.
## 1.0.9
- feat: Carousels now reset their timer in autoplay mode when they are paused.

## 1.0.7
- feat: multi-range component can now have a suffix value 

## 1.0.6
- fix: updated bar element

## 1.0.5
- chore: updated ignite to 5.0.2
- feat: experimental multi-range component
- feat: experimental calendar
- fix: combobox empty popups

## 1.0.3
- feat: updated shoelace to 2.15
- comboxbox fixes
- no shadowroot input fixes

## 1.0.1
- chore: testing Darkmode
- fix: Combobox now can have a defaultvalue

## 1.0.0
- feat: updated shoelace to 2.12
- chore: renamed sl-page-btn to sl-pagination
- BREAKING: removed bone component
- BREAKING: removed table component
- BREAKING: set bootstrap as default icon library. to use viur icons use library="viur"
- BREAKING: switch from ignite 4 to ignite 5

## 0.7.0
- feat: updated shoelace to 2.11
- feat: buttongroups now can handle inputs, selects and comboboxes
- feat: added a bar component
- feat: inputs can have a `upwrap` attribute to disable shadowroot to expose the input

## 0.6.3
- feat: updated shoelace to 2.10
- fix: Combobox now emits sl-change
- fix: Combobox sl-item-change is deprecated
- fix: Combobox uses focus() for dropdown highlighting
- fix: Combobox Dropdown selection also emit sl-change
- fix: Compobox now has a value property
- fix: suggestions and event emitting now works as expected

## 0.6.2
- fix: Combobox is available again

## 0.6.1
- fix: radiobuttons work now as expected
- fix: spinners now work as expected
- docs: replaced old viur packagename

## 0.6.0
- feat: updated to shoelace 2.7.0
- removed: ripple, router, scroll, spinner-circle
- fix: internal use spinner-viur
- reverted spinner-circle to spinner
- fix: radiobuttons always groups
- fix: always use box-sizing:border-box
- renamed package to @viur/shoelace

## 0.5.17
- fix: multiple entries now removeable again

## 0.5.16
- fix: table max height 

## 0.5.15
- fix: filebone now loads using data correctly

## 0.5.14
- fix: filebone now supports using skels

## 0.5.13
- fix: filebone changes
- fix: some multiple and language improvements

## 0.5.12
- fix: carousel multipages per view now works as expected
- feat: bones now can have a jinja flag
- feat: relations now can have a using skel
- feat: add multiple values fo bones by pressing enter
- feat: filebone mimetype fallback
- feat: more bone styling
- feat: textbone now can be a normal textarea

## 0.5.11
- chore: updated some docs
- fix: icons now working again

## 0.5.10
- feat: bones can have a force update attribute

## 0.5.9
- fix: filebone

## 0.5.8
- fix: table
- fix: filebone

## 0.5.7
- feat: removed default styling vom Docs
- feat: added viur dark mode

## 0.5.6
- fix: `sl-hide`, `sl-show`, `sl-after-show`, `sl-after-hide` events dont bubble anymore
- fix: added Bonevalue Wrapper
- feat: preparing Darkmode

## 0.5.5
- updated tabulator to v5.4.4
- fix for table selection
- fixes for table component
- removed slider. Please use the carousel component

## 0.5.4
- fix for select bones
- fix for setting relations on relationalbones

## 0.5.3
- Table bugfix

## 0.5.2
- Splitpanels now can have a minimizer
- Relational Bones can now have a external chooser
- Table fields can now set by method

## 0.5.1
- Tables are now horizontal Scrollable

## 0.5.0
Initial release

- Added secondary and info Theme Tokens
- Renamed Spinner to Spinner Circle
- Added ViUR Spinner
- Cards can be horizontal
- Cards can have a select State
- Icons unses the ViUR icon set as default
- Icons can use the bootstrap icons by using "bootstrap" as library
- Icons can have the sprites attribute to optimize performance
- Checkboxes are using the ViUR Styling
- Radios are using the ViUR Styling
- Switches are using the ViUR Styling
- Tab Groups can use the "flap" variant
- Added a Combobox Component for Autocompletion
- Added a Gallery Slider Component
- Added a Details Group Component
- Added a Back to Top Component
- Added a Map Component
- Added a Page Btn Component
- Added a Scroll Component
- Added a Orga Tree Component
- Added a Table Component
- Added a Table Wrapper Component
- Added a Bone Component