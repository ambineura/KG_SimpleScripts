// ==UserScript==
// @name		KG show diff in top
// @author		un4given (klavogonki.ru/u/#/111001)
// @version		1.1
// @description	Shows differences in xp on klavogonki.ru/top/
// @include     http*://klavogonki.ru/top/*
// ==/UserScript==

(function(){
	if (window.self != window.top) return;

	var xp 				= document.getElementsByClassName("highlight");
	var competitions	= document.getElementsByClassName("competitions");
	var names			= document.getElementsByClassName("name");
	for (i=1; i<xp.length; i++)
	{
		var currXP		= parseInt(xp[i].textContent || xp[i].innerText);
		var compCount	= parseInt(competitions[i].textContent || competitions[i].innerText);
		var ratePerX1	= (currXP/compCount).toFixed(2);
		var na			= "???";
		var nextDiff	= (i>1) ? parseInt(xp[i-1].textContent || xp[i-1].innerText)-currXP : na;
		var prevDiff	= (i<xp.length-1) ? currXP-parseInt(xp[i+1].textContent || xp[i+1].innerText) : na;
		var approxX1	= (nextDiff != na)?'; &times;' + Math.ceil(parseInt(nextDiff)/ratePerX1) : '';
		xp[i].innerHTML = '<span title="↑ +' + nextDiff +'; ↓ -' + prevDiff + approxX1 + '">' + xp[i].innerHTML + '</span>';
		names[i+1].innerHTML = names[i+1].innerHTML + ' <sup>(' + ratePerX1 + ')</sup>';
	}

})();