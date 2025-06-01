// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item "><a href="welcome.html">Welcome</a></li><li class="chapter-item "><a href="resume.html">Resume</a></li><li class="chapter-item "><a href="interests.html">Interests</a></li><li class="chapter-item "><a href="contact.html">Contact</a></li><li class="chapter-item "><a href="blog.html">Blog</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="2025-05-31/2025-05-31.html">2025/05/31 - Finally some usage</a></li><li class="chapter-item "><a href="2025-01-12/2025-01-12.html">2025/01/12 - Velocity &amp; Allocation</a></li><li class="chapter-item "><a href="2024-09-13/2024-09-13.html">2024/09/13 - RustConf Chronicles 3</a></li><li class="chapter-item "><a href="2024-09-12/2024-09-12.html">2024/09/12 - RustConf Chronicles 2</a></li><li class="chapter-item "><a href="2024-09-11/2024-09-11.html">2024/09/11 - RustConf Chronicles 1</a></li><li class="chapter-item "><a href="2024-05-18/2024-05-18.html">2024/05/18 - DevEx Brain Dump 1</a></li><li class="chapter-item "><a href="2024-02-17/2024-02-17.html">2024/02/17 - Harms of &quot;Maintenance Mode&quot;</a></li><li class="chapter-item "><a href="2024-01-20/2024-01-20.html">2024/01/20 - Blog Kickoff</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
