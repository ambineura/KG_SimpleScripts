// ==UserScript==
// @name		KG show truth about fuel
// @author		un4given (klavogonki.ru/u/#/111001)
// @run-at		document-end
// @version		1.3
// @description		Shows truth about fuel
// @include		http*://klavogonki.ru/fuel*/
// ==/UserScript==

(function(){
	if (window.self != window.top) return;

	(new MutationObserver(function(changes, observer) {
		var faq = document.querySelector('.faq');
		if (!faq) return;
		observer.disconnect();

		faq.innerHTML = `<h4>Что такое Дозаправка?</h4>

		<p>Изначально дозаправка была <a href="/forum/news/43/page1/#post1">публичным контрактом</a> (с гарантиями!) между <a href="/u/#/21/">Артчем</a> и клавогонщиками. Однако со временем она превратилась в какую-то «смешную и невероятно бесполезную хуйню»™, которая после <a href="https://www.telderi.ru/ru/viewsite/1059684">продажи Клавогонок с молотка</a> досталась в наследство <a href="/u/#/474104">Даниэлю</a>, который в зависимости от ситуации то хочет её «<a href="/chatlogs/2017-02-04.html#00:44:58">упразднить</a>», то наоборот ссылается на неё и рассказывает, что это «лучший способ <a href="/chatlogs/2020-05-01.html#01:17:18">сказать проекту спасибо!</a>»</p><br>

		<h4>Что отображено на шкале?</h4>
		<p>Раньше Артч <a href="/forum/news/43/page1/#post1">вещал нам</a>, что проект ежемесячно обходится ему как минимум в 20К рублей (собственно, это и есть минимальная цель), но <a href="https://www.telderi.ru/ru/viewsite/1059684">при продаже</a> внезапно оказалось, что расходов там всего лишь на 9К (6К − сервер, 3К − з\\п Перебору), а доходов − примерно 20К с дозаправки + 20К с рекламы в среднем. Зато после продажи самым невероятным образом выяснилось, что проект − вообще пиздец какой убыточный и Даниэль сам лично из своего кармана выкладывает по <a href="/chatlogs/2020-07-12.html#14:08:49">600К в год</a> «для поддержания штанов», лол! </p><br>

		<h4>Что я получу за это?</h4>
		<p>В благодарность за участие в Дозаправке вы получите хуй с маслом и ворох несбывшихся ожиданий. На самом деле вы можете получить возможность установки аэрографии (всего за 10 руб\\мес!), получить очков (по курсу 1 руб = 500 клавоочков) или получить нахуй никому не нужный «Премиум-аккаунт» всего лишь за 80 руб\\мес! (Реально профита с него никакого: ТСка безбожно глючит, метроном никому не усрался, разве что заезды удалять для красивой статистики)</p>

		<p>Кроме этого, за каждые 50 рублей вы получаете 1 голос для участия в голосовании за направления развития проекта. Только все эти голосования, равно как и «хотелки и благодарности», непонятно за каким хуем <a href="/forum/wishes/15306/">прилепленные Даниэлем в декабре 2018го года</a> − абсолютно нихуя не решают в принципе. Всё равно как ничего не делалось, так ничего и не делается. Такие дела!</p>`
	})).observe(document, {childList: true, subtree: true});
})();
