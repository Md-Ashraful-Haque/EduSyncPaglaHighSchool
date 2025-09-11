///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Start Search Option ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
$('#mobile_search_overlay, #desktop_search_overlay').click(function () {
	// alert("Search ICON");
	const element = document.getElementById('search_icon');
	element.classList.add('search_body_bg');
	// alert("Mobile Menu")
});

$('#search_cross_icon').click(function () {
	// alert("Search ICON");
	const element = document.getElementById('search_icon');
	element.classList.remove('search_body_bg');
});

$('#mobile_menu_expand_close').click(function () {
	const showImage = document.getElementById('mobile_menu_expand');
	const hideImage = document.getElementById('mobile_menu_close');

	hideImage.classList.toggle('mobile_menu_hide');
	showImage.classList.toggle('mobile_menu_show');
});

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// End Search Option ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//                                         section2
///////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Start Callapse for Mobile Menu  ////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

// ----------------- toggleExpandedIcon and add expanded class into expended_icon class  ---------------
/**
 *
 * @param thisObject
 * @param textToReplace
 */
function toggleExpandedIcon(thisObject, textToReplace) {
	if (textToReplace === '+') {
		thisObject.children().addClass('expanded');
		thisObject.next().addClass('show');
		thisObject.children().text('-');
	} else {
		thisObject.children().removeClass('expanded');
		thisObject.next().removeClass('show');
		thisObject.children().text('+');
	}
}

// ----------------- recursively remove all show class from a parent TAG ---------------
/**
 *
 * @param elements
 */
function removeShow(elements) {
	if (elements.length > 0) {
		elements.find('.dropdown-menu').removeClass('show');
		elements.find('.dropdown-menu').parent().find('.expanded').text('+');
		elements
			.find('.dropdown-menu')
			.parent()
			.find('.expanded')
			.removeClass('expanded');
		removeShow(elements.find('.dropdown-menu'));
	}
}

$(document).ready(function () {
	////////////////////////////// nav-link or Main Menu ///////////////////////////
	$('.nav-link').on('click', function () {
		$('.dropdown-menu').removeClass('show'); // hides all
		$(this).addClass('show');

		$('.expand_icon').removeClass('expanded'); // hides all
		const textToReplace = $(this).children().text();
		$('.expand_icon').text('+');

		$(this).children().addClass('expanded');
		toggleExpandedIcon($(this), textToReplace);
	});

	////////////////////////////// dropdown-item  ///////////////////////////

	$('.dropdown-item').on('click', function () {
		const textToReplace = $(this).children().text();
		toggleExpandedIcon($(this), textToReplace);

		removeShow($(this).next()); // Recusively remove show class from all child TAGs of this TAG

		// console.log($(this).parent().siblings().length)
		$(this)
			.parent()
			.siblings()
			.each(function () {
				//Here $(this) means one sibling of parent TAG
				removeShow($(this)); // Recusively remove show class from all child TAGs
			});
	});

	$('#mobile_menu_close').on('click', function () {
		setTimeout(function () {
			removeShow($('.nav-item'));
		}, 751); //.collapsing{transition:height 750ms ease}
	});
});

///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////   End Callapse for Mobile Menu  ////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//                                         section3
///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////   Start Scroll Effect on Navbar  ////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

// const body = document.body;
const header = document.querySelector('header');
const main = document.querySelector('main');

main.style.position = 'absolute';
// const headerHeight = document.querySelector('header').offsetHeight;
// main.style.top = headerHeight + "px";

let lastScroll = 0;
let initialScroll = 0;

// const cur = window.pageYOffset;
window.addEventListener('scroll', () => {
	const currentScroll = window.pageYOffset;
	if (currentScroll - lastScroll > 0) {
		// scrolled down -- header Hide
		header.classList.add('scroll-down');
		header.classList.remove('scroll-up');

		setTimeout(function () {
			removeShow($('.nav-item'));
		}, 751); //.collapsing{transition:height 750ms ease}

		// mobile_menu_close
		// mobile_menu_expand remove "mobile_menu_hide"
		// araf_main_menu --> remove "show"

		setTimeout(function () {
			$('#mobile_menu_expand').removeClass('mobile_menu_show');
			$('#mobile_menu_close').addClass('mobile_menu_hide');
			$('#araf_main_menu').removeClass('show');
		}, 751);

		// $('#mobile_menu_expand').removeClass('mobile_menu_show');
		// $('#mobile_menu_close').addClass('mobile_menu_hide');
		// $('#araf_main_menu').removeClass('show');
	} else {
		// scrolled up -- header show
		header.classList.add('scroll-up');
		header.classList.remove('scroll-down');
	}
	lastScroll = currentScroll;

  if (initialScroll === lastScroll) {
		header.style.backgroundColor = '';
    header.style.borderBottom = ''; 
  }
  else{
    header.style.backgroundColor = 'rgba(255,255,255,0.95)';
    header.style.borderBottom = '1px solid rgba(0,203,172,0.2)'; 
  }

});

///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////   End Scroll Effect on Navbar  ////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

// ((((((((((((((((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))))))))))))))))
// (((((((((((((((((((((((((((((((((((((( Start Positioning Sub menu ))))))))))))))))))))))))))))))))))))))
// ((((((((((((((((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))))))))))))))))
/**
 *
 * @param element
 */
function isDivOverflowing(element) {
	const rect = element.getBoundingClientRect();
	return (
		rect.top < 0 ||
		rect.left < 0 ||
		rect.bottom > window.innerHeight ||
		rect.right > window.innerWidth
	);
}

/**
 *
 * @param ulIDs
 */
function addRemoveClass(ulIDs) {
	for (const id of ulIDs) {
		// console.log(id);
		const divElement = document.getElementById(id);
		if (isDivOverflowing(divElement)) {
			divElement.classList.add('submenu_left');
		} else {
			divElement.classList.remove('submenu_left');
		}
	}
}

const mainMenu = document.getElementById('main-menu');
const submenuULs = mainMenu.querySelectorAll('ul.submenu');

const ulIDs = Array.from(submenuULs).map((ul) => ul.id);
addRemoveClass(ulIDs);
window.addEventListener('resize', function () {
	addRemoveClass(ulIDs);
});

// ((((((((((((((((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))))))))))))))))
// (((((((((((((((((((((((((((((((((((((( End Positioning Sub menu ))))))))))))))))))))))))))))))))))))))
// ((((((((((((((((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))))))))))))))))
