"use strict";

window.onclick = function(event)
{
	var toShow;

	// Ignore toggle and number menu clicks
	if (event.target.matches('.menuToggle') || event.target.matches('.menuNumber'))
	{
		return;
	}

	// If menu, prepare to show children
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

	// If clicked menu, show associated menu content
	if (toShow)
	{
		toShow.classList.add("show");
	}
}

