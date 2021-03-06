/*
	Copyright 2013 Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/
paella.Extended = Class.create({
	container:null,
	paellaContainer:null,
	rightContainer:null,
	bottomContainer:null,

	settings:{
		containerId:'paellaExtendedContainer',
		paellaContainerId:'playerContainer',
		rightContainerId:'paella_right',
		bottomContainerId:'paella_bottom',
		aspectRatio:1.777777,
		initDelegate:new paella.InitDelegate({accessControl:new paella.AccessControl(),videoLoader:new paella.VideoLoader})
	},
	
	rightBarPlugins:[],
	tabBarPlugins:[],
	
	currentTabIndex:0,
	bottomContainerTabs:null,
	bottomContainerContent:null,

	initialize:function(settings) {
		this.saveSettings(settings);
		this.loadPaellaExtended();
		var thisClass = this;
		$(window).resize(function(event) { thisClass.onresize() });
	},
	
	saveSettings:function(settings) {
		if (settings) {
			for (var key in settings) {
				this.settings[key] = settings[key];
			}
		}
	},
	
	loadPaellaExtended:function() {
		this.container = $('#' + this.settings.containerId)[0];
		if (!this.container) {
			var body = $('body')[0];
			body.innerHTML = "";
			this.container = document.createElement('div');
			this.container.id = this.settings.containerId;
			body.appendChild(this.container);
		}
		else {
			this.container.innerHTML = "";
		}
		
		this.paellaContainer = document.createElement('div');
		this.paellaContainer.id = this.settings.paellaContainerId;
		this.paellaContainer.className="playerContainer";
		this.container.appendChild(this.paellaContainer);
		
		this.rightContainer = document.createElement('div');
		this.rightContainer.id = this.settings.rightContainerId;
		this.rightContainer.className = "rightContainer";
		this.container.appendChild(this.rightContainer);
		
		this.bottomContainer = document.createElement('div');
		this.bottomContainer.id = this.settings.bottomContainerId;
		this.bottomContainer.className="bottomContainer";
		this.container.appendChild(this.bottomContainer);
		
		var tabs = document.createElement('div');
		tabs.id = 'bottomContainer_tabs';
		tabs.className = 'bottomContainerTabs';
		this.bottomContainerTabs = tabs;
		this.bottomContainer.appendChild(tabs);
		
		var bottomContent = document.createElement('div');
		bottomContent.id = 'bottomContainer_content';
		bottomContent.className = 'bottomContainerContent';
		this.bottomContainerContent = bottomContent;
		this.bottomContainer.appendChild(bottomContent);
		

		var thisClass = this;
		$(document).bind(paella.events.loadComplete,function(event,params) {
			thisClass.setMainProfile();
		});

		
		this.initPlugins();

		initPaellaEngage(this.paellaContainer.id,this.settings.initDelegate);
		this.onresize();
	},
	
	initPlugins:function() {
		paella.pluginManager.setTarget('rightBarPlugin',this);
		paella.pluginManager.setTarget('tabBarPlugin',this);
	},
	
	addPlugin:function(plugin) {
		var thisClass = this;
		plugin.checkEnabled(function(isEnabled) {
			if (isEnabled) {
				if (plugin.type=='rightBarPlugin') {
					thisClass.rightBarPlugins.push(plugin);
					thisClass.addRightBarItem(plugin.getRootNode('paellaExtended_rightBar_'));
				}
				if (plugin.type=='tabBarPlugin') {
					thisClass.tabBarPlugins.push(plugin);
					thisClass.addTab(plugin.getTabName(),plugin.getRootNode('paellaExtended_tabBar_'));
				}	
			}
		});
	},
	
	showTab:function(tabIndex) {
		for (var i=0;i<this.tabBarPlugins.length;++i) {
			var tabItem = $("#tab_" + i)[0];
			var tabContent = $("#tab_content_" + i)[0];
		
			if (i==tabIndex) {
				tabItem.className = "bottomContainerTabItem enabledTabItem";
				tabContent.className = "bottomContainerContent enabledTabContent";
			}
			else {
				tabItem.className = "bottomContainerTabItem disabledTabItem";
				tabContent.className = "bottomContainerContent disabledTabContent";			
			}
		}
	},

	addTab:function(name,content) {
		var tabIndex = this.currentTabIndex;
		
		// Add tab
		var tabItem = document.createElement('div');
		tabItem.id = "tab_" + tabIndex;
		tabItem.className = "bottomContainerTabItem disabledTabItem";
		tabItem.innerHTML = name;
		var thisClass = this;
		$(tabItem).click(function(event) { thisClass.showTab(tabIndex); });
		this.bottomContainerTabs.appendChild(tabItem);
		
		// Add tab content
		var tabContent = document.createElement('div');
		tabContent.id = "tab_content_" + tabIndex;
		tabContent.className = "bottomContainerContent disabledTabContent";
		tabContent.appendChild(content.domElement);
		this.bottomContainerContent.appendChild(tabContent);
		
		// Show tab
		this.showTab(tabIndex);
		++this.currentTabIndex;
	},
	
	addRightBarItem:function(content) {
		this.rightContainer.appendChild(content.domElement);
	},

	setMainProfile:function() {
		var profile = 'full';
		var cookieProfile = paella.utils.cookies.get("paella.extended.profile");
		if (cookieProfile) {
			profile = cookieProfile;
		}
		else if ((paella) && (paella.player) && (paella.player.config) && (paella.player.config.player) && (paella.player.config.player.defaultProfile)){
			profile = paella.player.config.player.defaultProfile;
		}
		this.setProfile(profile);
	},
	
	setProfile:function(profileName) {
		paella.utils.cookies.set("paella.extended.profile", profileName);
		var thisClass = this;
		this.container.className = "paellaExtendedContainer " + profileName;
		this.paellaContainer.className = "playerContainer " + profileName;
		this.rightContainer.className = "rightContainer " + profileName;
		this.bottomContainer.className = "bottomContainer " + profileName;
		this.onresize();
		if (paella.player) {
			paella.player.onresize();
		}
	},
	
	onresize:function() {
	/*
		var aspect = this.settings.aspectRatio;
		var width = jQuery(this.paellaContainer).width();
		var height = width / aspect;
		this.paellaContainer.style.height = height + 'px';
	*/
	}
});

function initPaellaExtended(settings) {
	paella.extended = new paella.Extended(settings);
}
