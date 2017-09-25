"use strict";

function menu_toggle_getIsChecked()
{
	return this.classList.contains("checked");
}

function menu_number_getValue()
{
	var result = this.dataset.val;
	if (!result) { result = "10"; }
	return parseFloat(result);
}
function menu_number_getMinimum()
{
	var result = this.dataset.min;
	if (!result) { result = "0"; }
	return parseFloat(result);
}
function menu_number_getMaximum()
{
	var result = this.dataset.max;
	if (!result) { result = "99"; }
	return parseFloat(result);
}
function menu_number_getIncrement()
{
	var result = this.dataset.inc;
	if (!result) { result = "1"; }
	return parseFloat(result);
}

function menu_toggleClick()
{
	this.classList.toggle("checked");
}

function menu_numberClick()
{
	var menuNumber = this.parentElement;
	var value = menuNumber.getValue();
	if (this.classList.contains("menuNumber_less"))
	{
		value -= menuNumber.getIncrement();
		if (value < menuNumber.getMinimum())
		{
			value = menuNumber.getMinimum();
		}
	}
	if (this.classList.contains("menuNumber_more"))
	{
		value += menuNumber.getIncrement();
		if (value > menuNumber.getMaximum())
		{
			value = menuNumber.getMaximum();
		}
	}
	if (value != menuNumber.getValue())
	{
		menuNumber.dataset.value = value;
		menuNumber.getElementsByClassName('menuNumber_value')[0].innerHTML = value;
	}
}

function menu_windowClick(event)
{
	var toShow;

	// Ignore toggle and number menu clicks
	if (event.target.matches('.menuContent') ||
	    event.target.matches('.menuContent hr') ||
	    event.target.matches('.menuToggle') ||
	    event.target.matches('.menuNumber') ||
	    event.target.matches('.menuNumber_less') ||
	    event.target.matches('.menuNumber_more') ||
	    event.target.matches('.menuNumber_value'))
	{
		return;
	}

	// If menu, remember associated menu content to show
	if (event.target.matches('.menu'))
	{
		var menu = event.target;
		var next = menu.nextElementSibling;
		if (next.classList.contains("menuContent") && !next.classList.contains("show"))
		{
			toShow = next;
			toShow.style.left = menu.offsetLeft;
		}
	}

	// Close all menu contents
	var menuContent = document.getElementsByClassName("menuContent");
	for (var i = 0; i < menuContent.length; i++) {
		var menuContentItem = menuContent[i];
		if (menuContentItem.classList.contains('show'))
		{
			menuContentItem.classList.remove('show');
		}
	}

	// If clicked a menu, show associated menu content
	if (toShow)
	{
		toShow.classList.add("show");
	}
}

window.addEventListener("DOMContentLoaded", function(event)
{
	// General clicks
	window.addEventListener("click", menu_windowClick);
	// Toggle clicks
	var toggles = document.getElementsByClassName('menuToggle');
	for(var i = 0; i < toggles.length; ++i)
	{
		toggles[i].addEventListener("click", menu_toggleClick);
		toggles[i].getIsChecked = menu_toggle_getIsChecked;
	}
	// Number ui
	var numbers = document.getElementsByClassName('menuNumber');
	for(var i = 0; i < numbers.length; ++i)
	{
		numbers[i].getValue = menu_number_getValue;
		numbers[i].getMinimum = menu_number_getMinimum;
		numbers[i].getMaximum = menu_number_getMaximum;
		numbers[i].getIncrement = menu_number_getIncrement;
		var content = numbers[i].innerHTML;
		content += "<button class='menuNumber_more'></button>";
		content += "<span class='menuNumber_value'>" + numbers[i].getValue() + "</span>";
		content += "<button class='menuNumber_less'></button>";
		numbers[i].innerHTML = content;
		numbers[i].getElementsByClassName('menuNumber_less')[0].
			addEventListener("click", menu_numberClick);
		numbers[i].getElementsByClassName('menuNumber_more')[0].
			addEventListener("click", menu_numberClick);
	}
});

