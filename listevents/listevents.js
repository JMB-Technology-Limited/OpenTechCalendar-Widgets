/**
 * OpenTechCalendar Event List Widget
 * @license BSD-3 Clause License
 */

var OpenTechCalendarWidgetListEvents = {
	cssAdded: false,
	callBackFunctionCount: 0,
	place: function(divid, options) {
		var usingOptions = {
			eventCount: 5,
			title: undefined,
			maxStringLength: 300,
			groupID: undefined,
			locationID: undefined,
			venueID: undefined,
			curatedListID: undefined,
			openInNewWindow: true,
			loadCSS: true
		}
		for (var prop in options) {
			if (options.hasOwnProperty(prop)) {
				usingOptions[prop] = options[prop];
			}
		}
		var div = document.getElementById(divid);
		if (!div) return;
		var moreURL;
		if (usingOptions.groupID) {
			moreURL = "http://opentechcalendar.co.uk/group/"+usingOptions.groupID;
		} else if (usingOptions.locationID) {
			moreURL = "http://opentechcalendar.co.uk/location/"+usingOptions.locationID;
		} else if (usingOptions.venueID) {
			moreURL = "http://opentechcalendar.co.uk/venue/"+usingOptions.locationID;
		} else if (usingOptions.curatedListID) {
			moreURL = "http://opentechcalendar.co.uk/list/"+usingOptions.curatedListID;
		} else {
			moreURL = "http://opentechcalendar.co.uk/event/";
		}

		var target = usingOptions['openInNewWindow'] ? ' target="_BLANK"' : '';

		div.innerHTML = '<div class="OpenTechCalendarWidgetListEventsData">'+
				'<div class="OpenTechCalendarWidgetListEventsHeader"><a href="'+moreURL+'" '+target+' id="'+divid+'Title">'+OpenTechCalendarWidgetListEvents.escapeHTML(usingOptions.title?usingOptions.title:'Events')+'</a></div>'+
				'<div class="OpenTechCalendarWidgetListEventsEvents" id="'+divid+'Data">Loading</div>'+
				'<div class="OpenTechCalendarWidgetListEventsFooter">'+
					'<div class="OpenTechCalendarWidgetListEventsFooterMore"><a href="'+moreURL+'" '+target+'>See more ...</a></div>'+
					'<div class="OpenTechCalendarWidgetListEventsFooterCredit">Data from <a href="http://opentechcalendar.co.uk" '+target+'>Open Tech Calendar</a></div>'+
					'<div class="OpenTechCalendarWidgetListEventsFooterSponsor" id="'+divid+'Sponsor">&nbsp;</div>'+
				'</div>'+
			'</div>';
		var dataDiv = document.getElementById(divid+"Data");
		var headTag = document.getElementsByTagName('head').item(0);

		if (!OpenTechCalendarWidgetListEvents.cssAdded  && usingOptions.loadCSS) {	
			var link = document.createElement("link");
			link.type = "text/css"; 
			link.href = "http://opentechcalendar.co.uk/css/widgetEventList.css?v=1"; 
			link.rel = "stylesheet"; 
			headTag.appendChild(link);
			OpenTechCalendarWidgetListEventsCssAdded = true;
		}

		OpenTechCalendarWidgetListEvents.callBackFunctionCount++;
		window["OpenTechCallBackFunction"+OpenTechCalendarWidgetListEvents.callBackFunctionCount] = function(data) {			
			var html = '';
			var limit = Math.min(data.data.length, usingOptions.eventCount);
			if (limit <= 0) {
				html = '<div class="OpenTechCalendarWidgetListEventsEventNone">No events</div>';
			} else {
				for (var i=0;i<limit;i++) {
					html += OpenTechCalendarWidgetListEvents.htmlFromEvent(data.data[i], usingOptions.maxStringLength, target);
				}
			}

			dataDiv.innerHTML=html;

			if (data.sponsorsHTML) {
				var sponsorDiv = document.getElementById(divid+"Sponsor");
				sponsorDiv.innerHTML = 'Sponsored by '+data.sponsorsHTML;
			}

			if (!usingOptions.title) {
				var titleDiv = document.getElementById(divid+"Title");
				titleDiv.innerHTML = "Open Tech Calendar";
			}
		}
		var url;
		if (usingOptions.groupID) {
			url = "http://opentechcalendar.co.uk/api1/group/"+usingOptions.groupID+"/jsonp";
		} else if (usingOptions.locationID) {
			url = "http://opentechcalendar.co.uk/api1/legacylocation/"+usingOptions.locationID+"/jsonp";
		} else if (usingOptions.venueID) {
			url = "http://opentechcalendar.co.uk/api1/venue/"+usingOptions.venueID+"/jsonp";
		} else if (usingOptions.curatedListID) {
			url = "http://opentechcalendar.co.uk/api1/curatedlist/"+usingOptions.curatedListID+"/jsonp";
		} else {
			url = "http://opentechcalendar.co.uk/api1/event/jsonp";
		}

		var script = document.createElement("script");
		script.type = "text/javascript"; 
		script.src = url+"?callback=OpenTechCallBackFunction"+OpenTechCalendarWidgetListEvents.callBackFunctionCount;
		headTag.appendChild(script);

	},
	htmlFromEvent: function(event, maxLength, target) {
		var html = '<div class="OpenTechCalendarWidgetListEventsEvent">'
		html += '<div class="OpenTechCalendarWidgetListEventsDate">'+event.start.displaylocal+'</div>';
		html += '<div class="OpenTechCalendarWidgetListEventsSummary"><a href="'+event.siteurl+'" '+target+'>'+OpenTechCalendarWidgetListEvents.escapeHTML(event.summaryDisplay)+'</a></div>';
		html += '<div class="OpenTechCalendarWidgetListEventsDescription">'+OpenTechCalendarWidgetListEvents.escapeHTMLNewLine(event.description, maxLength)+'</div>';
		html += '<a class="OpenTechCalendarWidgetListEventsMoreLink" href="'+event.siteurl+'" '+target+'>More Info</a>';
		html += '<div class="OpenTechCalendarWidgetListEventsClear"></div>';	
		return html+'</div>';
	},			
	escapeHTML: function(str) {
		var div = document.createElement('div');
		div.appendChild(document.createTextNode(str));
		return div.innerHTML;
	},
	escapeHTMLNewLine: function(str, maxLength) {
		var div = document.createElement('div');
		div.appendChild(document.createTextNode(str));
		var out =  div.innerHTML;
		if (out.length > maxLength) {
			out = out.substr(0,maxLength)+" ...";
		}
		return out.replace(/\n/g,'<br>');
	}	
}
