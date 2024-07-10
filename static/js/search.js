    document.querySelector('html').classList.add('search');

    document.addEventListener('DOMContentLoaded', function() {
      let searchTerm = new URLSearchParams(window.location.search).get('q');
      let fetchingElem = document.getElementById('bing-results-container');

      if (!searchTerm) {
        if (fetchingElem) fetchingElem.style.display = 'none';
      }
    });

    window.renderGoogleSearchResults = () => {
        var cx = '013288817511911618469:elfqqbqldzg';
        var gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = true;
        gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//cse.google.com/cse.js?cx=' + cx;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);
    }

    window.renderPageFindSearchResults = () => {
        let urlParams = new URLSearchParams(window.location.search);
        let searchTerm = urlParams.get("q") || "";
        let sidebarSearch = document.querySelector('.td-sidebar__search');
        if (sidebarSearch) {
            sidebarSearch.remove();
        }
        document.getElementById('search').style.display = 'block';
        pagefind = new PagefindUI({ element: "#search", showImages: false });
        if (searchTerm) {
            pagefind.triggerSearch(searchTerm);
        }

        document.querySelector("#search input").addEventListener("input", function() {
            var inputValue = this.value;
            var queryStringVar = "q";
            updateQueryString(queryStringVar, inputValue);
        });
    }

	function updateQueryString(key, value) {
		var baseUrl = window.location.href.split("?")[0];
		var queryString = window.location.search.slice(1);
		var urlParams = new URLSearchParams(queryString);

		if (urlParams.has(key)) {
			urlParams.set(key, value);
		} else {
			urlParams.append(key, value);
		}

		var newUrl = baseUrl + "?" + urlParams.toString();
		// Update the browser history (optional)
        history.replaceState(null, '', newUrl);
	}

    // China Verification.
    var path = "path=/;"
    d = new Date()
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000))
    expires = "expires=" + d.toUTCString()

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
        else return "";
    }

    async function checkBlockedSite(url) {
        try {
            const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
            // If we reach this point, the site is accessible (since mode: 'no-cors' doesn't allow us to check response.ok)
            return false;
        } catch (error) {
            // If an error occurs, it's likely the site is blocked
            return true;
        }
    }

    async function runBlockedContentTest() {
        if (getCookie("in_china") === "") {
            const isBlocked = await checkBlockedSite("https://www.google.com/favicon.ico");
            if ( isBlocked ) {
                // Site is blocked so we think you are in China.
                console.log("We think you ARE in China")
                document.cookie = "in_china=true;" + path + expires
                window.renderPageFindSearchResults()
            } else {
                // Site isn't blocked so we think you are NOT in China.
                console.log("We think you are NOT in China")
                document.cookie = "in_china=false;" + path + expires
                window.renderGoogleSearchResults()
            }
        } else if (getCookie("in_china") == "true") {
            window.addEventListener('DOMContentLoaded', (event) => {
                window.renderPageFindSearchResults()
            });
        } else {
            window.renderGoogleSearchResults()
        }
    }

    window.onload = runBlockedContentTest;

