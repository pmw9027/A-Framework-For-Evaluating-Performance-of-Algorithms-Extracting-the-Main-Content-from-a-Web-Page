/*
 * Copyright (c) 2010 Apple Inc. All rights reserved.
 */
/*
 * Copyright (c) 2010 Apple Inc. All rights reserved.
 *
 * Portions Copyright (c) 2009 Arc90 Inc
 * Readability. An Arc90 Lab Experiment.
 * Website: http://lab.arc90.com/experiments/readability
 * Source:  http://code.google.com/p/arc90labs-readability
 * Readability is licensed under the Apache License, Version 2.0.
 */


function hostnameMatchesHostKnownToContainEmbeddableMedia(e) {
  return /^(.+\.)?(youtube\.com|vimeo\.com|dailymotion\.com|soundcloud\.com|mixcloud\.com|embedly\.com|embed\.ly)\.?$/.test(e)
}
function lazyLoadingImageURLForElement(e, t) {
  const n = /(data:image\/)?gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==/,
      r = {
          "data-lazy-src": 1,
          "data-original": 1,
          datasrc: 1,
          "data-src": 1,
          "original-src": 1,
          "rel:bf_image_src": 1,
          "deferred-src": 1,
          "data-mediaviewer-src": 1,
          "data-hi-res-src": 1
      },
      i = {
          original: 1
      };
  var a = e.getAttribute("src"),
      o = /transparent|empty/i.test(a) || n.test(a);
  const l = 2;
  for (var s = e, c = 0; s && c < l; s = s.parentElement, ++c)
      for (var u = attributesForElement(s), m = u.length, d = 0; d < m; ++d) {
          var h = u[d].nodeName;
          if (r[h.toLowerCase()])
              return s.getAttribute(h);
          var g = /\.(jpe?g|png|gif|bmp)$/i.test(u[h].value);
          if (i[h.toLowerCase()] && g)
              return s.getAttribute(h);
          if (o && /^data.*(src|source)$/i.test(h) && g)
              return s.getAttribute(h)
      }
  if (LazyLoadRegex.test(t) && "function" == typeof URL) {
      var f;
      try {
          f = new URL(e.src)
      } catch (e) {}
      if (f && f.search) {
          var p,
              E;
          const t = ["w", "width"];
          for (var v = t.length, d = 0; d < v; ++d) {
              var N = t[d],
                  C = f.searchParams.get(N);
              if (C && !isNaN(parseInt(C))) {
                  p = N;
                  break
              }
          }
          const n = ["h", "height"];
          for (var A = n.length, d = 0; d < A; ++d) {
              var S = n[d],
                  R = f.searchParams.get(S);
              if (R && !isNaN(parseInt(R))) {
                  E = S;
                  break
              }
          }
          if (p && E) {
              var T = e.getAttribute("width"),
                  y = e.getAttribute("height");
              if (!isNaN(parseInt(T)) && !isNaN(parseInt(y)))
                  return f.searchParams.set(p, T), f.searchParams.set(E, y), f.href
          }
      }
  }
  return null
}
function sanitizeElementByRemovingAttributes(e) {
  const t = /^on|^id$|^class$|^style$|^autofocus$/;
  for (var n = attributesForElement(e), r = 0; r < n.length; ++r) {
      var i = n[r].nodeName;
      t.test(i) && (e.removeAttribute(i), r--)
  }
}
function characterNeedsScoreMultiplier(e) {
  if (!e || 0 === e.length)
      return !1;
  var t = e.charCodeAt(0);
  return t > 11904 && t < 12031 || (t > 12352 && t < 12543 || (t > 12736 && t < 19903 || (t > 19968 && t < 40959 || (t > 44032 && t < 55215 || (t > 63744 && t < 64255 || (t > 65072 && t < 65103 || (t > 131072 && t < 173791 || t > 194560 && t < 195103)))))))
}
function domDistance(e, t, n) {
  for (var r = [], i = e; i;)
      r.unshift(i), i = i.parentNode;
  var a = [];
  for (i = t; i;)
      a.unshift(i), i = i.parentNode;
  for (var o = Math.min(r.length, a.length), l = Math.abs(r.length - a.length), s = o; s >= 0 && r[s] !== a[s]; --s)
      if (l += 2, n && l >= n)
          return n;
  return l
}
function fontSizeFromComputedStyle(e, t) {
  var n = parseInt(e.fontSize);
  return isNaN(n) && (n = t || BaseFontSize), n
}
function contentTextStyleForNode(e, t) {
  function n(e) {
      if (isNodeWhitespace(e))
          return null;
      var t = getComputedStyle(e.parentNode);
      return "none" !== t.float ? null : t
  }
  for (var r = "descendant::text()[not(parent::h1) and not(parent::h2) and not(parent::h3) and not(parent::h4) and not(parent::h5) and not(parent::h6)]", i = e.evaluate(r, t, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), a = i.snapshotLength, o = 0; o < a; ++o) {
      for (var l = i.snapshotItem(o), s = !1, c = l.parentElement; c !== t; c = c.parentElement)
          if (NegativeRegEx.test(c.className)) {
              s = !0;
              break
          }
      if (!s) {
          var u = n(l);
          if (u)
              return u
      }
  }
  return null
}
function isNodeWhitespace(e) {
  return !(!e || e.nodeType !== Node.TEXT_NODE) && !/\S/.test(e.data)
}
function removeWhitespace(e) {
  return e.replace(/\s+/g, "")
}
function isElementNode(e) {
  return !(!e || e.nodeType !== Node.ELEMENT_NODE)
}
function computedStyleIndicatesElementIsInvisibleDueToClipping(e) {
  if ("absolute" !== e.position)
      return !1;
  var t = e.clip.match(/^rect\((\d+px|auto), (\d+px|auto), (\d+px|auto), (\d+px|auto)\)$/);
  if (!t || 5 !== t.length)
      return !1;
  var n = t.map(function(e) {
          return parseInt(e)
      }),
      r = n[1];
  isNaN(r) && (r = 0);
  var i = n[2],
      a = n[3],
      o = n[4];
  return isNaN(o) && (o = 0), r >= a || i >= o
}
function isElementVisible(e) {
  var t = getComputedStyle(e);
  if ("visible" !== t.visibility || "none" === t.display)
      return !1;
  if (cachedElementBoundingRect(e).height)
      return !0;
  var n = document.createRange();
  return n.selectNode(e), !!n.getBoundingClientRect().height
}
function isElementPositionedOffScreen(e) {
  var t = cachedElementBoundingRect(e);
  return !(!t.height || !t.width) && (t.bottom <= 0 || t.right <= 0)
}
function elementDepth(e) {
  for (var t = 0; e; e = e.parentElement)
      t++;
  return t
}
function depthOfElementWithinElement(e, t) {
  for (var n = 0; e !== t; e = e.parentElement) {
      if (!e)
          return NaN;
      n++
  }
  return n
}
function nearestAncestorElementWithTagName(e, t, n) {
  var r = {};
  if (n)
      for (var i = 0; i < n.length; ++i)
          r[n[i]] = !0;
  if (r[e.tagName])
      return null;
  for (; e = e.parentElement;) {
      var a = e.tagName;
      if (r[a])
          break;
      if (a === t)
          return e
  }
  return null
}
function cachedElementBoundingRect(e) {
  if (e._cachedElementBoundingRect)
      return e._cachedElementBoundingRect;
  var t = e.getBoundingClientRect();
  return ReaderArticleFinderJS._elementsWithCachedBoundingRects.push(e), ReaderArticleFinderJS._cachedScrollX || ReaderArticleFinderJS._cachedScrollY ? (e._cachedElementBoundingRect = {
      top: t.top + ReaderArticleFinderJS._cachedScrollY,
      right: t.right + ReaderArticleFinderJS._cachedScrollX,
      bottom: t.bottom + ReaderArticleFinderJS._cachedScrollY,
      left: t.left + ReaderArticleFinderJS._cachedScrollX,
      width: t.width,
      height: t.height
  }, e._cachedElementBoundingRect) : (e._cachedElementBoundingRect = t, e._cachedElementBoundingRect)
}
function clearCachedElementBoundingRects() {
  for (var e = ReaderArticleFinderJS._elementsWithCachedBoundingRects, t = e.length, n = 0; n < t; ++n)
      e[n]._cachedElementBoundingRect = null;
  ReaderArticleFinderJS._elementsWithCachedBoundingRects = []
}
function trimmedInnerTextIgnoringTextTransform(e) {
  var t = e.innerText;
  if (!/\S/.test(t))
      return e.textContent.trim();
  var n = getComputedStyle(e),
      r = n.textTransform;
  return "uppercase" === r || "lowercase" === r ? e.textContent.trim() : t ? t.trim() : ""
}
function levenshteinDistance(e, t) {
  for (var n = e.length, r = t.length, i = new Array(n + 1), a = 0; a < n + 1; ++a)
      i[a] = new Array(r + 1), i[a][0] = a;
  for (var o = 0; o < r + 1; ++o)
      i[0][o] = o;
  for (var o = 1; o < r + 1; ++o)
      for (var a = 1; a < n + 1; ++a)
          if (e[a - 1] === t[o - 1])
              i[a][o] = i[a - 1][o - 1];
          else {
              var l = i[a - 1][o] + 1,
                  s = i[a][o - 1] + 1,
                  c = i[a - 1][o - 1] + 1;
              i[a][o] = Math.min(l, s, c)
          }
  return i[n][r]
}
function stringSimilarity(e, t) {
  var n = Math.max(e.length, t.length);
  return n ? (n - levenshteinDistance(e, t)) / n : 0
}
function stringsAreNearlyIdentical(e, t) {
  return e === t || stringSimilarity(e, t) > StringSimilarityToDeclareStringsNearlyIdentical
}
function elementIsCommentBlock(e) {
  if (/(^|\s)comment/.test(e.className))
      return !0;
  var t = e.getAttribute("id");
  return !(!t || 0 !== t.indexOf("comment"))
}
function elementLooksLikeEmbeddedTweet(e) {
  var t = null;
  if (e instanceof HTMLIFrameElement) {
      if (!e.contentDocument)
          return !1;
      t = e.contentDocument.documentElement
  } else
      "TWITTER-WIDGET" === e.tagName && (t = e.shadowRoot);
  if (!t)
      return !1;
  if (e.closest(".twitter-video") && t.querySelector("[data-tweet-id]"))
      return !0;
  let n = 0,
      r = t.querySelector("blockquote");
  r && TweetURLRegex.test(r.getAttribute("cite")) && ++n;
  let i = t.querySelector("[data-iframe-title]");
  return i && TweetIframeTitleRegex.test(i.getAttribute("data-iframe-title")) && ++n, e.classList.contains("twitter-tweet") && ++n, t.querySelector("[data-tweet-id]") && ++n, n > 2
}
function elementLooksLikePartOfACarousel(e) {
  const t = /carousel-|carousel_|-carousel|_carousel/,
      n = 3;
  for (var r = e, i = 0; i < n; ++i) {
      if (!r)
          return !1;
      if (t.test(r.className) || t.test(r.getAttribute("data-analytics")))
          return !0;
      r = r.parentElement
  }
}
function anchorIsHTTPFamilyProtocol(e) {
  let t = e.protocol;
  return "http:" === t || "https:" === t
}
function shouldPruneIframe(e, t) {
  if (e.srcdoc)
      return !0;
  let n = anchorForURL(e.src, t);
  return !anchorIsHTTPFamilyProtocol(n) || !hostnameMatchesHostKnownToContainEmbeddableMedia(n.hostname) && !elementLooksLikeEmbeddedTweet(e.originalElement)
}
function languageScoreMultiplierForTextNodes(e) {
  if (!e || !e.length)
      return 1;
  for (var t = Math.min(e.length, DefaultNumberOfTextNodesToCheckForLanguageMultiplier), n = 0, r = 0, i = 0; i < t; i++) {
      for (var a = e[i].nodeValue.trim(), o = Math.min(a.length, NumberOfCharactersPerTextNodeToEvaluateForLanguageMultiplier), l = 0; l < o; l++)
          characterNeedsScoreMultiplier(a[l]) && n++;
      r += o
  }
  return n >= r * MinimumRatioOfCharactersForLanguageMultiplier ? ScoreMultiplierForChineseJapaneseKorean : 1
}
function scoreMultiplierForElementTagNameAndAttributes(e) {
  for (var t = 1, n = e; n; n = n.parentElement) {
      var r = n.getAttribute("id");
      r && (ArticleRegEx.test(r) && (t += ArticleMatchBonus), CommentRegEx.test(r) && (t -= CommentMatchPenalty), CarouselRegEx.test(r) && (t -= CarouselMatchPenalty));
      var i = n.className;
      i && (ArticleRegEx.test(i) && (t += ArticleMatchBonus), CommentRegEx.test(i) && (t -= CommentMatchPenalty), CarouselRegEx.test(i) && (t -= CarouselMatchPenalty)), "ARTICLE" === n.tagName && (t += ArticleMatchBonus)
  }
  return t < 0 ? 0 : t
}
function elementAtPoint(e, t) {
  if ("undefined" != typeof ReaderArticleFinderJSController && ReaderArticleFinderJSController.nodeAtPoint) {
      var n = ReaderArticleFinderJSController.nodeAtPoint(e, t);
      return n && n.nodeType !== Node.ELEMENT_NODE && (n = n.parentElement), n
  }
  return document.elementFromPoint(e, t)
}
function userVisibleURLString(e) {
  return "undefined" != typeof ReaderArticleFinderJSController && ReaderArticleFinderJSController.userVisibleURLString ? ReaderArticleFinderJSController.userVisibleURLString(e) : e
}
function urlStringIsJavaScriptURL(e) {
  return !!e && "javascript:" === e.trim().substring(0, 11).toLowerCase()
}
function anchorForURL(e, t) {
  var n = t.createElement("a");
  return n.href = e, n
}
function anchorLinksToAttachment(e) {
  return /\battachment\b/i.test(e.getAttribute("rel"))
}
function anchorLinksToTagOrCategoryPage(e) {
  return /\bcategory|tag\b/i.test(e.getAttribute("rel"))
}
function anchorLooksLikeDownloadFlashLink(e) {
  return /^https?:\/\/(www\.|get\.)(adobe|macromedia)\.com\/(((products|[a-zA-Z]{1,2}|)\/flashplayer|flashplayer|go\/getflash(player)?)|(shockwave\/download\/(index|download)\.cgi\?P1_Prod_Version=ShockwaveFlash)\/?$)/i.test(e.href)
}
function elementsHaveSameTagAndClassNames(e, t) {
  return e.tagName === t.tagName && e.className === t.className
}
function selectorForElement(e) {
  for (var t = e.tagName, n = e.classList, r = n.length, i = 0; i < r; i++)
      t += "." + n[i];
  return t
}
function elementFingerprintForDepth(e, t) {
  function n(e, t) {
      if (!e)
          return "";
      var o = [];
      o.push(selectorForElement(e));
      var l = e.children,
          s = l.length;
      if (s && t > 0) {
          o.push(r);
          for (var c = 0; c < s; ++c)
              o.push(n(l[c], t - 1)), c !== s - 1 && o.push(a);
          o.push(i)
      }
      return o.join("")
  }
  const r = " / ",
      i = " \\",
      a = " | ";
  return n(e, t)
}
function childrenOfParentElement(e) {
  var t = e.parentElement;
  return t ? t.children : []
}
function arrayOfKeysAndValuesOfObjectSortedByValueDescending(e) {
  var t = [];
  for (var n in e)
      e.hasOwnProperty(n) && t.push({
          key: n,
          value: e[n]
      });
  return t.sort(function(e, t) {
      return t.value - e.value
  }), t
}
function walkElementSubtree(e, t, n) {
  if (!(t < 0)) {
      for (var r = e.children, i = r.length, a = t - 1, o = 0; o < i; ++o)
          walkElementSubtree(r[o], a, n);
      n(e, t)
  }
}
function elementIndicatesItIsASchemaDotOrgArticleContainer(e) {
  var t = e.getAttribute("itemtype");
  return /^https?:\/\/schema\.org\/((News)?Article|APIReference)$/.test(t)
}
function elementIndicatesItIsASchemaDotOrgImageObject(e) {
  var t = e.getAttribute("itemtype");
  return "https://schema.org/ImageObject" === t || "http://schema.org/ImageObject" === t
}
function elementWouldAppearBetterAsFigureOrAuxiliary(e, t) {
  const n = /caption/i;
  if (!e)
      return !1;
  if (t.closest("figure, .auxiliary"))
      return !1;
  if (elementIndicatesItIsASchemaDotOrgImageObject(e) && !t.querySelector("figure, .auxiliary"))
      return !0;
  var r = t.ownerDocument,
      i = r.createTreeWalker(t, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
          acceptNode: function() {
              return NodeFilter.FILTER_ACCEPT
          }
      });
  i.currentNode = t;
  for (var a = !1, o = !1; i.nextNode();) {
      var l = i.currentNode;
      if (l.nodeType !== Node.TEXT_NODE) {
          if (l.nodeType !== Node.ELEMENT_NODE)
              return !1;
          var s = l.tagName;
          if ("FIGURE" === s || "TABLE" === s)
              return !1;
          if (l.classList.contains("auxiliary"))
              return !1;
          if ("IMG" === s) {
              if (a)
                  return !1;
              a = !0
          }
          var c = l.originalElement;
          o || c && !hasClassMatchingRegexp(l.originalElement, n) || !/\S/.test(l.innerText) || (o = !0)
      } else if (!a && /\S/.test(l.nodeValue))
          return !1
  }
  return a && o
}
function cleanStyleAndClassList(e) {
  e.classList.length || e.removeAttribute("class"), e.getAttribute("style") || e.removeAttribute("style")
}
function getVisibleNonWhitespaceTextNodes(e, t, n, r, i) {
  function a(e) {
      var t = e.children[0];
      if (t)
          for (var n = t.children, r = n.length, i = 0; i < r; ++i)
              if ("none" !== getComputedStyle(n[i]).float)
                  return !1;
      return !0
  }
  function o(e, r) {
      if (e.nodeType === Node.TEXT_NODE)
          return void (/\S/.test(e.nodeValue) && s.push(e));
      if (e.nodeType === Node.ELEMENT_NODE && isElementVisible(e) && !(n && ++l > n || i && i.has(e) || e instanceof HTMLIFrameElement)) {
          let n = e.tagName;
          if ("FORM" !== n) {
              if (c[n])
                  r--;
              else if ("UL" !== n && "OL" !== n || !a(e)) {
                  var u = e.parentElement;
                  if (u) {
                      var m = u.tagName;
                      "SECTION" !== m || e.previousElementSibling || e.nextElementSibling || r--
                  }
              } else
                  r--;
              var d = r + 1;
              if (d < t)
                  for (var h = e.childNodes, g = h.length, f = 0; f < g; ++f)
                      o(h[f], d)
          }
      }
  }
  var l = 0,
      s = [],
      c = {
          P: 1,
          STRONG: 1,
          B: 1,
          EM: 1,
          I: 1,
          SPAN: 1,
          SECTION: 1
      };
  return r && (c.CENTER = 1, c.FONT = 1), o(e, 0), s
}
function mapOfVisibleTextNodeComputedStyleReductionToNumberOfMatchingCharacters(e, t) {
  const n = 100;
  for (var r = {}, i = getVisibleNonWhitespaceTextNodes(e, n), a = i.length, o = 0; o < a; ++o) {
      var l = i[o],
          s = l.length,
          c = l.parentElement,
          u = getComputedStyle(c),
          m = t(u);
      r[m] ? r[m] += s : r[m] = s
  }
  return r
}
function keyOfMaximumValueInDictionary(e) {
  var t,
      n;
  for (var r in e) {
      var i = e[r];
      (!n || i > n) && (t = r, n = i)
  }
  return t
}
function elementIsProtected(e) {
  return e.classList.contains("protected") || e.querySelector(".protected")
}
function dominantFontFamilyAndSizeForElement(e) {
  return keyOfMaximumValueInDictionary(mapOfVisibleTextNodeComputedStyleReductionToNumberOfMatchingCharacters(e, function(e) {
      return e.fontFamily + "|" + e.fontSize
  }))
}
function dominantFontSizeInPointsFromFontFamilyAndSizeString(e) {
  return e ? parseInt(e.split("|")[1]) : null
}
function canvasElementHasNoUserVisibleContent(e) {
  if (!e.width || !e.height)
      return !0;
  for (var t = e.getContext("2d"), n = t.getImageData(0, 0, e.width, e.height).data, r = 0, i = n.length; r < i; r += 4) {
      if (n[r + 3])
          return !1
  }
  return !0
}
function findArticleNodeSelectorsInWhitelistForHostname(e, t) {
  const n = [[AppleDotComAndSubdomainsRegex, "*[itemprop='articleBody']"], [/^(.+\.)?buzzfeed\.com\.?$/, "article #buzz_sub_buzz"], [/^(.+\.)?mashable\.com\.?$/, ".parsec-body .parsec-container"], [/^(.+\.)?cnet\.com\.?$/, "#rbContent.container"], [/^(.+\.)?engadget\.com\.?$/, "main article #page_body"], [/^(.*\.)?m\.wikipedia\.org\.?$/, "#content #bodyContent"]];
  for (var r = n.length, i = 0; i < r; ++i) {
      var a = n[i];
      if (a[0].test(e.toLowerCase())) {
          if (t(a[1]))
              return
      }
  }
}
function functionToPreventPruningDueToInvisibilityInWhitelistForHostname(e) {
  const t = [[/^mobile\.nytimes\.com\.?$/, function(e, t) {
      var n = e;
      if (!t)
          return !1;
      for (; n && n !== t;) {
          if (n.classList.contains("hidden"))
              return !0;
          n = n.parentElement
      }
      return !1
  }]];
  for (var n = t.length, r = 0; r < n; ++r) {
      var i = t[r];
      if (i[0].test(e.toLowerCase()))
          return i[1]
  }
  return null
}
function elementIsAHeader(e) {
  return !!{
      H1: 1,
      H2: 1,
      H3: 1,
      H4: 1,
      H5: 1,
      H6: 1
  }[e.tagName]
}
function leafElementForElementAndDirection(e, t) {
  var n = e.ownerDocument,
      r = n.createTreeWalker(n.body, NodeFilter.SHOW_ELEMENT, {
          acceptNode: function(e) {
              return 0 === e.children.length ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
          }
      });
  return r.currentNode = e, r[t]()
}
function previousLeafElementForElement(e) {
  return leafElementForElementAndDirection(e, "previousNode")
}
function nextLeafElementForElement(e) {
  return leafElementForElementAndDirection(e, "nextNode")
}
function nextNonFloatingVisibleElementSibling(e) {
  for (var t = e; t = t.nextElementSibling;)
      if (isElementVisible(t) && "none" === getComputedStyle(t).float)
          return t;
  return null
}
function elementWithLargestAreaFromElements(e) {
  var t = e.length;
  if (!t)
      return null;
  for (var n, r = 0, i = 0; i < t; ++i) {
      var a = e[i],
          o = cachedElementBoundingRect(a),
          l = o.width * o.height;
      l > r && (n = a, r = l)
  }
  return n
}
function unwrappedArticleContentElement(e) {
  for (var t = e;;) {
      for (var n = t.childNodes, r = n.length, i = null, a = 0; a < r; ++a) {
          var o = n[a],
              l = o.nodeType;
          if (function() {
              return l === Node.ELEMENT_NODE || l === Node.TEXT_NODE && !isNodeWhitespace(o)
          }()) {
              if (i)
                  return t;
              var s = o.tagName;
              if ("DIV" !== s && "ARTICLE" !== s && "SECTION" !== s)
                  return t;
              i = o
          }
      }
      if (!i)
          break;
      t = i
  }
  return t
}
function elementsMatchingClassesInClassList(e, t) {
  return elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t)
}
function elementsMatchingClassesInClassListIgnoringCommonLayoutClassNames(e, t) {
  return elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t, /clearfix/i)
}
function elementsMatchingClassesInClassListIgnoringClassesWithNumericSuffix(e, t) {
  return elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t, /\d+$/)
}
function elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t, n) {
  for (var r = "", i = e.length, a = 0; a < i; ++a) {
      var o = e[a];
      n && n.test(o) || (r += "." + o)
  }
  try {
      return t.querySelectorAll(r)
  } catch (e) {
      return []
  }
}
function imageIsContainedByContainerWithImageAsBackgroundImage(e) {
  var t = e.parentElement;
  if (!t || !t.style || !t.style.backgroundImage)
      return !1;
  var n = /url\((.*)\)/.exec(t.style.backgroundImage);
  return !(!n || 2 !== n.length) && n[1] === e.src
}
function pseudoElementContent(e, t) {
  var n = getComputedStyle(e, t).content,
      r = /^\"(.*)\"$/.exec(n);
  return r && 2 == r.length ? r[1] : n
}
function hasClassMatchingRegexp(e, t) {
  for (var n = e.classList, r = n.length, i = 0; i < r; ++i)
      if (t.test(n[i]))
          return !0;
  return !1
}
function elementLooksLikeDropCap(e) {
  return hasClassMatchingRegexp(e, DropCapRegex) && 1 === e.innerText.length
}
function changeElementType(e, t) {
  for (var n = e.ownerDocument.createElement(t), r = attributesForElement(e), i = r.length, a = 0; a < i; ++a) {
      var o = r.item(a);
      n.setAttribute(o.nodeName, o.nodeValue)
  }
  for (; e.firstChild;)
      n.appendChild(e.firstChild);
  return e.replaceWith(n), n
}
function pathComponentsForAnchor(e) {
  var t = e.pathname.substring(1).split("/");
  return t[t.length - 1] || t.pop(), t
}
function lastPathComponentFromAnchor(e) {
  var t = pathComponentsForAnchor(e);
  return t.length ? t[t.length - 1] : null
}
function clamp(e, t, n) {
  return Math.min(Math.max(e, t), n)
}
function normalizedElementTagName(e) {
  return e.localName
}
function childrenWithParallelStructure(e) {
  var t = e.children;
  if (!t)
      return [];
  var n = t.length;
  if (!n)
      return [];
  for (var r = {}, i = 0; i < n; ++i) {
      var a = t[i];
      if (!CandidateTagNamesToIgnore[a.tagName] && a.className)
          for (var o = a.classList, l = o.length, s = 0; s < l; ++s) {
              var c = o[s],
                  u = r[c];
              u ? u.push(a) : r[c] = [a]
          }
  }
  var m = Math.floor(n / 2);
  for (var c in r) {
      var u = r[c];
      if (u.length > m)
          return u
  }
  return []
}
function elementAppearsToBeCollapsed(e) {
  return !(!ReaderArticleFinderJS.isMediaWikiPage() || !/collaps/.test(e.className)) || "false" === e.getAttribute("aria-expanded") && !isElementVisible(e)
}
const ReaderMinimumScore = 1600,
  ReaderMinimumAdvantage = 15,
  ArticleMinimumScoreDensity = 4.25,
  CandidateMinimumWidthPortionForIndicatorElements = .5,
  CandidateMinumumListItemLineCount = 4,
  CandidateTagNamesToIgnore = {
      A: 1,
      EMBED: 1,
      FORM: 1,
      HTML: 1,
      IFRAME: 1,
      OBJECT: 1,
      OL: 1,
      OPTION: 1,
      SCRIPT: 1,
      STYLE: 1,
      svg: 1,
      UL: 1
  },
  PrependedArticleCandidateMinimumHeight = 50,
  AppendedArticleCandidateMinimumHeight = 200,
  AppendedArticleCandidateMaximumVerticalDistanceFromArticle = 150,
  StylisticClassNames = {
      justfy: 1,
      justify: 1,
      left: 1,
      right: 1,
      small: 1
  },
  CommentRegEx = /comment|meta|footer|footnote/,
  CommentMatchPenalty = .75,
  ArticleRegEx = /(?:(?:^|\s)(?:(post|hentry|entry)[-_]?(?:content|text|body)?|article[-_]?(?:content|text|body|page)?)(?:\s|$))/i,
  ArticleMatchBonus = .5,
  CarouselRegEx = /carousel/i,
  CarouselMatchPenalty = .75,
  SectionRegex = /section|content.*component/i,
  DropCapRegex = /first.*letter|drop.*cap/i,
  ProgressiveLoadingRegex = /progressive/i,
  DensityExcludedElementSelector = "#disqus_thread, #comments, .userComments",
  PositiveRegEx = /article|body|content|entry|hentry|page|pagination|post|related-asset|text/i,
  NegativeRegEx = /advertisement|breadcrumb|combx|comment|contact|disqus|footer|link|meta|mod-conversations|promo|related|scroll|share|shoutbox|sidebar|social|sponsor|spotim|subscribe|tags|toolbox|widget|[-_]ad$|zoom-(in|out)/i,
  VeryPositiveClassNameRegEx = /instapaper_body/,
  VeryNegativeClassNameRegEx = /instapaper_ignore/,
  SharingRegex = /email|print|rss|digg|slashdot|delicious|reddit|share|twitter|facebook|pinterest|whatsapp/i,
  VeryLiberalCommentRegex = /comment/i,
  AdvertisementHostRegex = /^adserver\.|doubleclick.net$/i,
  SidebarRegex = /sidebar/i,
  MinimumAverageDistanceBetweenHRElements = 400,
  MinimumAverageDistanceBetweenHeaderElements = 400,
  PortionOfCandidateHeightToIgnoreForHeaderCheck = .1,
  DefaultNumberOfTextNodesToCheckForLanguageMultiplier = 3,
  NumberOfCharactersPerTextNodeToEvaluateForLanguageMultiplier = 12,
  MinimumRatioOfCharactersForLanguageMultiplier = .5,
  ScoreMultiplierForChineseJapaneseKorean = 3,
  MinimumContentMediaHeight = 150,
  MinimumContentMediaWidthToArticleWidthRatio = .25,
  MaximumContentMediaAreaToArticleAreaRatio = .2,
  LinkContinueMatchRegEx = /continue/gi,
  LinkNextMatchRegEx = /next/gi,
  LinkPageMatchRegEx = /page/gi,
  LinkListItemBonus = 5,
  LinkPageMatchBonus = 10,
  LinkNextMatchBonus = 15,
  LinkContinueMatchBonus = 15,
  LinkNextOrdinalValueBase = 3,
  LinkMismatchValueBase = 2,
  LinkMatchWeight = 200,
  LinkMaxVerticalDistanceFromArticle = 200,
  LinkVerticalDistanceFromArticleWeight = 150,
  LinkCandidateXPathQuery = "descendant-or-self::*[(not(@id) or (@id!='disqus_thread' and @id!='comments')) and (not(@class) or @class!='userComments')]/a",
  LinkDateRegex = /\D(?:\d\d(?:\d\d)?[\-\/](?:10|11|12|0?[1-9])[\-\/](?:30|31|[12][0-9]|0?[1-9])|\d\d(?:\d\d)?\/(?:10|11|12|0[1-9])|(?:10|11|12|0?[1-9])\-(?:30|31|[12][0-9]|0?[1-9])\-\d\d(?:\d\d)?|(?:30|31|[12][0-9]|0?[1-9])\-(?:10|11|12|0?[1-9])\-\d\d(?:\d\d)?)\D/,
  LinkURLSearchParameterKeyMatchRegex = /(page|^p$|^pg$)/i,
  LinkURLPageSlashNumberMatchRegex = /\/.*page.*\/\d+/i,
  LinkURLSlashDigitEndMatchRegex = /\/\d+\/?$/,
  LinkURLArchiveSlashDigitEndMatchRegex = /archives?\/\d+\/?$/,
  LinkURLBadSearchParameterKeyMatchRegex = /author|comment|feed|id|nonce|related/i,
  LinkURLSemanticMatchBonus = 100,
  LinkMinimumURLSimilarityRatio = .75,
  HeaderMinimumDistanceFromArticleTop = 200,
  HeaderLevenshteinDistanceToLengthRatio = .75,
  MinimumRatioOfListItemsBeingRelatedToSharingToPruneEntireList = .5,
  FloatMinimumHeight = 130,
  ImageSizeTiny = 32,
  ToleranceForLeadingMediaWidthToArticleWidthForFullWidthPresentation = 80,
  MaximumFloatWidth = 325,
  AnchorImageMinimumWidth = 100,
  AnchorImageMinimumHeight = 100,
  MinimumHeightForImagesAboveTheArticleTitle = 50,
  MainImageMinimumWidthAndHeight = 83,
  BaseFontSize = 16,
  BaseLineHeightRatio = 1.125,
  MaximumExactIntegralValue = 9007199254740992,
  TitleCandidateDepthScoreMultiplier = .1,
  TextNodeLengthPower = 1.25,
  LazyLoadRegex = /lazy/i,
  HeaderElementsSelector = "h1, h2, h3, h4, h5, h6",
  PageType = {
      homepage: "homepage",
      searchResults: "search-results",
      article: "article"
  },
  StringSimilarityToDeclareStringsNearlyIdentical = .97,
  FindArticleMode = {
      Element: !1,
      ExistenceOfElement: !0
  },
  AppleDotComAndSubdomainsRegex = /.*\.apple\.com\.?$/,
  SchemaDotOrgArticleContainerSelector = "*[itemtype='https://schema.org/Article'], *[itemtype='https://schema.org/NewsArticle'], *[itemtype='https://schema.org/APIReference'], *[itemtype='http://schema.org/Article'], *[itemtype='http://schema.org/NewsArticle'], *[itemtype='http://schema.org/APIReference']",
  CleaningType = {
      MainArticleContent: 0,
      MetadataContent: 1,
      LeadingMedia: 2
  },
  MaximumWidthOrHeightOfImageInMetadataSection = 20;
var attributesForElement = function() {
  var e = Element.prototype.__lookupGetter__("attributes");
  return function(t) {
      return e.call(t)
  }
}();
const TweetURLRegex = /^https?:\/\/(.+\.)?twitter\.com\/.*\/status\/(.*\/)*[0-9]+\/?$/i,
  TweetIframeTitleRegex = /tweet/i;
CandidateElement = function(e, t) {
  this.element = e, this.contentDocument = t, this.textNodes = this.usableTextNodesInElement(this.element), this.rawScore = this.calculateRawScore(), this.tagNameAndAttributesScoreMultiplier = this.calculateElementTagNameAndAttributesScoreMultiplier(), this.languageScoreMultiplier = 0, this.depthInDocument = 0
}, CandidateElement.extraArticleCandidateIfElementIsViable = function(e, t, n, r) {
  const i = "a, b, strong, i, em, u, span";
  var a = cachedElementBoundingRect(e),
      o = cachedElementBoundingRect(t.element);
  if ((r && a.height < PrependedArticleCandidateMinimumHeight || !r && a.height < AppendedArticleCandidateMinimumHeight) && e.childElementCount && e.querySelectorAll("*").length !== e.querySelectorAll(i).length)
      return null;
  if (r) {
      if (a.bottom > o.top)
          return null
  } else if (a.top < o.bottom)
      return null;
  if (!r) {
      if (a.top - o.bottom > AppendedArticleCandidateMaximumVerticalDistanceFromArticle)
          return null
  }
  if (a.left > o.right || a.right < o.left)
      return null;
  if (elementLooksLikePartOfACarousel(e))
      return null;
  var l = new CandidateElement(e, n);
  return l.isPrepended = r, l
}, CandidateElement.candidateIfElementIsViable = function(e, t, n) {
  var r = cachedElementBoundingRect(e),
      i = ReaderArticleFinderJS.candidateElementFilter;
  return r.width < i.minimumWidth || r.height < i.minimumHeight ? null : r.width * r.height < i.minimumArea ? null : !n && r.top > i.maximumTop ? null : CandidateElement.candidateElementAdjustedHeight(e) < i.minimumHeight ? null : new CandidateElement(e, t)
}, CandidateElement.candidateElementAdjustedHeight = function(e) {
  for (var t = cachedElementBoundingRect(e), n = t.height, r = e.getElementsByTagName("form"), i = r.length, a = 0; a < i; ++a) {
      var o = r[a],
          l = cachedElementBoundingRect(o);
      l.width > t.width * CandidateMinimumWidthPortionForIndicatorElements && (n -= l.height)
  }
  for (var s = e.querySelectorAll("ol, ul"), c = s.length, u = null, a = 0; a < c; ++a) {
      var m = s[a];
      if (!(u && u.compareDocumentPosition(m) & Node.DOCUMENT_POSITION_CONTAINED_BY)) {
          var d = m.getElementsByTagName("li"),
              h = d.length,
              g = cachedElementBoundingRect(m);
          if (h) {
              var f = g.height / h,
                  p = getComputedStyle(d[0]),
                  E = parseInt(p.lineHeight);
              if (isNaN(E)) {
                  E = fontSizeFromComputedStyle(p) * BaseLineHeightRatio
              }
              g.width > t.width * CandidateMinimumWidthPortionForIndicatorElements && f / E < CandidateMinumumListItemLineCount && (n -= g.height, u = m)
          } else
              n -= g.height
      }
  }
  return n
}, CandidateElement.prototype = {
  calculateRawScore: function() {
      for (var e = 0, t = this.textNodes, n = t.length, r = 0; r < n; ++r)
          e += this.rawScoreForTextNode(t[r]);
      return e
  },
  calculateElementTagNameAndAttributesScoreMultiplier: function() {
      return scoreMultiplierForElementTagNameAndAttributes(this.element)
  },
  calculateLanguageScoreMultiplier: function() {
      0 === this.languageScoreMultiplier && (this.languageScoreMultiplier = languageScoreMultiplierForTextNodes(this.textNodes))
  },
  depth: function() {
      return this.depthInDocument || (this.depthInDocument = elementDepth(this.element)), this.depthInDocument
  },
  finalScore: function() {
      return this.calculateLanguageScoreMultiplier(), this.basicScore() * this.languageScoreMultiplier
  },
  basicScore: function() {
      return this.rawScore * this.tagNameAndAttributesScoreMultiplier
  },
  scoreDensity: function() {
      var e = 0,
          t = this.element.querySelector(DensityExcludedElementSelector);
      t && (e = t.clientWidth * t.clientHeight);
      for (var n = this.element.children || [], r = n.length, i = 0; i < r; ++i) {
          var a = n[i];
          elementIsCommentBlock(a) && (e += a.clientWidth * a.clientHeight)
      }
      for (var o = cachedElementBoundingRect(this.element).width * cachedElementBoundingRect(this.element).height, l = o * MaximumContentMediaAreaToArticleAreaRatio, s = cachedElementBoundingRect(this.element).width * MinimumContentMediaWidthToArticleWidthRatio, c = this.element.querySelectorAll("img, object, video"), u = c.length, i = 0; i < u; ++i) {
          var m = cachedElementBoundingRect(c[i]);
          if (m.width >= s && m.height > MinimumContentMediaHeight) {
              var d = m.width * m.height;
              d < l && (e += d)
          }
      }
      for (var h = this.basicScore(), g = o - e, f = this.textNodes.length, p = 0, E = 0, i = 0; i < f; ++i) {
          var v = this.textNodes[i].parentNode;
          v && (E += fontSizeFromComputedStyle(getComputedStyle(v)), p++)
      }
      var N = BaseFontSize;
      return p && (N = E /= p), this.calculateLanguageScoreMultiplier(), h / g * 1e3 * (N / BaseFontSize) * this.languageScoreMultiplier
  },
  usableTextNodesInElement: function(e) {
      var t = [];
      if (!e)
          return t;
      const n = {
          A: 1,
          DD: 1,
          DT: 1,
          NOSCRIPT: 1,
          OL: 1,
          OPTION: 1,
          PRE: 1,
          SCRIPT: 1,
          STYLE: 1,
          TD: 1,
          UL: 1,
          IFRAME: 1
      };
      var r = this.contentDocument,
          i = function(e) {
              const i = "text()|*/text()|*/a/text()|*/li/text()|*/li/p/text()|*/span/text()|*/em/text()|*/i/text()|*/strong/text()|*/b/text()|*/font/text()|blockquote/*/text()|div[count(./p)=count(./*)]/p/text()|div[count(*)=1]/div/p/text()|div[count(*)=1]/div/p/*/text()";
              for (var a = r.evaluate(i, e, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), o = a.snapshotLength, l = 0; l < o; ++l) {
                  var s = a.snapshotItem(l);
                  n[s.parentNode.tagName] || s._countedTextNode || isNodeWhitespace(s) || (s._countedTextNode = !0, t.push(s))
              }
          };
      i(e);
      for (var a = childrenWithParallelStructure(e), o = a.length, l = 0; l < o; ++l) {
          i(a[l])
      }
      for (var s = t.length, l = 0; l < s; ++l)
          delete t[l]._countedTextNode;
      return t
  },
  addTextNodesFromCandidateElement: function(e) {
      for (var t = this.textNodes.length, n = 0; n < t; ++n)
          this.textNodes[n].alreadyCounted = !0;
      for (var r = e.textNodes, i = r.length, n = 0; n < i; ++n)
          r[n].alreadyCounted || this.textNodes.push(r[n]);
      for (var t = this.textNodes.length, n = 0; n < t; ++n)
          this.textNodes[n].alreadyCounted = null;
      this.rawScore = this.calculateRawScore()
  },
  rawScoreForTextNode: function(e) {
      const t = 20;
      if (!e)
          return 0;
      var n = e.length;
      if (n < t)
          return 0;
      var r = e.parentNode;
      if (!isElementVisible(r))
          return 0;
      for (var i = 1; r && r !== this.element;)
          i -= .1, r = r.parentNode;
      return Math.pow(n * i, TextNodeLengthPower)
  },
  shouldDisqualifyDueToScoreDensity: function() {
      return this.scoreDensity() < ArticleMinimumScoreDensity
  },
  shouldDisqualifyDueToHorizontalRuleDensity: function() {
      for (var e = this.element.getElementsByTagName("hr"), t = e.length, n = 0, r = cachedElementBoundingRect(this.element), i = .7 * r.width, a = 0; a < t; ++a)
          e[a].clientWidth > i && n++;
      if (n) {
          if (r.height / n < MinimumAverageDistanceBetweenHRElements)
              return !0
      }
      return !1
  },
  shouldDisqualifyDueToHeaderDensity: function() {
      var e = "(h1|h2|h3|h4|h5|h6|*/h1|*/h2|*/h3|*/h4|*/h5|*/h6)[a[@href]]",
          t = this.contentDocument.evaluate(e, this.element, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null),
          n = t.snapshotLength;
      if (n > 2) {
          for (var r = 0, i = cachedElementBoundingRect(this.element), a = i.height * PortionOfCandidateHeightToIgnoreForHeaderCheck, o = 0; o < n; ++o) {
              var l = t.snapshotItem(o),
                  s = cachedElementBoundingRect(l);
              s.top - i.top > a && i.bottom - s.bottom > a && r++
          }
          if (i.height / r < MinimumAverageDistanceBetweenHeaderElements)
              return !0
      }
      return !1
  },
  shouldDisqualifyDueToSimilarElements: function(e) {
      function t(e, t) {
          if (!e || !t)
              return !1;
          var n = 1;
          return e.className ? e.className === t.className : elementFingerprintForDepth(e, n) === elementFingerprintForDepth(t, n)
      }
      var n = function(e) {
              const t = /related-posts/i;
              for (var n = e.parentElement; n && n !== this.contentDocument.body; n = n.parentElement)
                  if (t.test(n.className))
                      return !0;
              return !1
          }.bind(this),
          r = this.element;
      if ("ARTICLE" === r.parentElement.tagName)
          return !1;
      if ("LI" === r.tagName || "DD" === r.tagName)
          for (var i = r.parentNode, a = i.children.length, o = 0; o < a; ++o) {
              var l = i.children[o];
              if (l.tagName === r.tagName && l.className === r.className && l !== r)
                  return !0
          }
      var s = r.classList;
      if (s.length || (r = r.parentElement) && (s = r.classList, s.length || (r = r.parentElement) && (s = r.classList)), s.length) {
          e || (e = []);
          for (var c = e.length, o = 0; o < c; ++o)
              e[o].element.candidateElement = e[o];
          for (var u = elementsMatchingClassesInClassListIgnoringCommonLayoutClassNames(s, this.contentDocument), m = !1, d = elementDepth(r), h = n(r), g = u.length, o = 0; o < g; ++o) {
              var l = u[o];
              if (l !== r && (l.parentElement !== r && r.parentElement !== l && isElementVisible(l))) {
                  var f = l.candidateElement;
                  if ((f || (f = new CandidateElement(l, this.contentDocument))) && f.basicScore() * ReaderMinimumAdvantage > this.basicScore()) {
                      if (l.closest("section") && r.closest("section"))
                          return !1;
                      if (SectionRegex.test(l.className) && SectionRegex.test(r.className))
                          return !1;
                      if (n(l) && !h)
                          return !1;
                      if (!m && cachedElementBoundingRect(l).bottom < cachedElementBoundingRect(this.element).top) {
                          m = !0;
                          continue
                      }
                      if (t(r.previousElementSibling, l.previousElementSibling) || t(r.nextElementSibling, l.nextElementSibling)) {
                          var p = r.querySelector(HeaderElementsSelector),
                              E = l.querySelector(HeaderElementsSelector);
                          if (p && E && elementsHaveSameTagAndClassNames(p, E))
                              return !0;
                          if (p = r.previousElementSibling, E = l.previousElementSibling, p && E && elementIsAHeader(p) && elementIsAHeader(E) && elementsHaveSameTagAndClassNames(p, E))
                              return !0
                      }
                      if (elementDepth(l) === d)
                          for (; l.parentElement && r.parentElement && l.parentElement !== r.parentElement;)
                              l = l.parentElement, r = r.parentElement;
                      for (; r.childElementCount <= 1;) {
                          if (!r.childElementCount || !l.childElementCount)
                              return !1;
                          if (l.childElementCount > 1)
                              return !1;
                          if (r.firstElementChild.tagName !== l.firstElementChild.tagName)
                              return !1;
                          r = r.firstElementChild, l = l.firstElementChild
                      }
                      if (l.childElementCount <= 1)
                          return !1;
                      var E = l.firstElementChild,
                          v = l.lastElementChild,
                          p = r.firstElementChild,
                          N = r.lastElementChild;
                      if (E.tagName !== p.tagName)
                          return !1;
                      if (v.tagName !== N.tagName)
                          return !1;
                      var C = E.className,
                          A = v.className,
                          S = p.className,
                          R = v.className,
                          T = R === S ? 2 : 1;
                      if (C.length || S.length) {
                          if (!C.length || !S.length)
                              return !1;
                          if (C === S && elementsMatchingClassesInClassList(p.classList, r).length <= T)
                              return !0
                      }
                      if (A.length || R.length) {
                          if (!A.length || !R.length)
                              return !1;
                          if (A === R && elementsMatchingClassesInClassList(v.classList, r).length <= T)
                              return !0
                      }
                      var y = p.clientHeight,
                          b = N.clientHeight;
                      return !(!y || !E.clientHeight) && (!(!b || !v.clientHeight) && (y === E.clientHeight || b === v.clientHeight))
                  }
              }
          }
          for (var o = 0; o < c; ++o)
              e[o].element.candidateElement = null
      }
      return !1
  },
  shouldDisqualifyForDeepLinking: function() {
      const e = 5;
      for (var t = this.element, n = this.contentDocument.location, r = pathComponentsForAnchor(n), i = r.length, a = [], o = t.getElementsByTagName("a"), l = o.length, s = 0; s < l; s++) {
          var c = o[s];
          if (n.host === c.host && !(pathComponentsForAnchor(c).length <= i || 0 !== (c.host + c.pathname).indexOf(n.host + n.pathname) || anchorLinksToAttachment(c) || (a.push(c), a.length < e))) {
              var u = t.offsetTop + t.offsetHeight / e;
              return a[0].offsetTop < u
          }
      }
      return !1
  }
}, String.prototype.lastInteger = function() {
  const e = /[0-9]+/g;
  var t = this.match(e);
  return t ? parseInt(t[t.length - 1]) : NaN
};
ReaderArticleFinder = function(e) {
  this.contentDocument = e, this.didSearchForArticleNode = !1, this.article = null, this.didSearchForExtraArticleNode = !1, this.extraArticle = null, this._leadingMediaElement = null, this._isMediaWikiPage = undefined, this._cachedScrollY = 0, this._cachedScrollX = 0, this._elementsWithCachedBoundingRects = [], this._cachedContentTextStyle = null, this.pageNumber = 1, this.prefixWithDateForNextPageURL = null, this.previouslyDiscoveredPageURLStrings = [], this.candidateElementFilter = {
      minimumWidth: 280,
      minimumHeight: 295,
      minimumArea: 17e4,
      maxTop: 1300
  }
}, ReaderArticleFinder.prototype = {
  setCandidateElementFilter: function(e) {
      let [t, n] = this._validityAndValidCandidateElementFilterFromFilter(e);
      t && (this.candidateElementFilter = n)
  },
  _validityAndValidCandidateElementFilterFromFilter: function(e) {
      let t = {},
          n = !1;
      for (let i of ["minimumWidth", "minimumHeight", "minimumArea", "maxTop"]) {
          let r = (e || {})[i];
          if (r === undefined || "number" != typeof r || r < 0) {
              t = {}, n = !1;
              break
          }
          t[i] = r, n = !0
      }
      return [n, t]
  },
  isReaderModeAvailable: function() {
      return !!this.findArticleBySearchingWhitelist() || (this.cacheWindowScrollPosition(), !!this.findArticleFromMetadata(FindArticleMode.ExistenceOfElement) || (this.article = this.findArticleByVisualExamination(), this.article && this.articleIsLTR(), !!this.article))
  },
  reloadArticleContent: function() {
      this.didSearchForArticleNode = !1, this.didSearchForExtraArticleNode = !1, delete this.article, delete this.extraArticle, delete this._articleTitleInformation, delete this._leadingMediaElement, delete this._cachedContentTextStyle, delete this._adoptableArticle, delete this._articleIsLTR, delete this._nextPageURL, this._isMediaWikiPage = undefined, this.prepareToTransitionToReader()
  },
  prepareToTransitionToReader: function() {
      this.adoptableArticle(!0), this.nextPageURL(), this.articleIsLTR()
  },
  nextPageURL: function() {
      if (!this._nextPageURL) {
          var e = this.nextPageURLString();
          "undefined" != typeof ReaderArticleFinderJSController && e && (e = ReaderArticleFinderJSController.substituteURLForNextPageURL(e)), this._nextPageURL = e
      }
      return this._nextPageURL
  },
  containerElementsForMultiPageContent: function() {
      const e = /(.*page[^0-9]*|.*article.*item[^0-9]*)(\d{1,2})(.*)/i;
      for (var t, n = [], i = this.articleNode(), r = 0; !(t = e.exec(i.getAttribute("id")));)
          if (!(i = i.parentElement) || 3 == r++)
              return [];
      for (var a = childrenOfParentElement(i), l = a.length, o = 0; o < l; ++o) {
          var s = a[o];
          if (s !== i) {
              var c = e.exec(s.getAttribute("id"));
              c && c[1] === t[1] && c[3] === t[3] && (isElementVisible(s) && !isElementPositionedOffScreen(s) || n.push(s))
          }
      }
      return n
  },
  adoptableMultiPageContentElements: function() {
      return this.containerElementsForMultiPageContent().map(function(e) {
          return this.cleanArticleNode(e, e.cloneNode(!0), CleaningType.MainArticleContent, !1)
      }, this)
  },
  classNameIsSignificantInRouteComputation: function(e) {
      return !!e && !(e.toLowerCase() in StylisticClassNames)
  },
  shouldIgnoreInRouteComputation: function(e) {
      return "SCRIPT" === e.tagName || "LINK" === e.tagName || "STYLE" === e.tagName || "TR" === e.tagName && !e.offsetHeight
  },
  routeToArticleNode: function() {
      for (var e = [], t = this.articleNode(); t;) {
          var n = {};
          n.tagName = t.tagName;
          var i = t.getAttribute("id");
          i && (n.id = i), this.classNameIsSignificantInRouteComputation(t.className) && (n.className = t.className), n.index = 1;
          for (var r = t.previousElementSibling; r; r = r.previousElementSibling)
              this.shouldIgnoreInRouteComputation(r) || n.index++;
          e.unshift(n), t = t.parentElement
      }
      return e
  },
  adjustArticleNodeUpwardIfNecessary: function() {
      if (this.article) {
          var e = this.article.element;
          if (e.parentElement) {
              for (var t = e; t; t = t.parentElement)
                  if (VeryPositiveClassNameRegEx.test(t.className))
                      return void (this.article.element = t);
              if ("HEADER" === e.tagName && "ARTICLE" === e.parentElement.tagName)
                  return void (this.article.element = e.parentElement);
              var n = e.previousElementSibling;
              if (n && "FIGURE" === n.tagName && "ARTICLE" === e.parentElement.tagName)
                  return void (this.article.element = e.parentElement);
              var i = "SECTION" === e.tagName ? e : nearestAncestorElementWithTagName(e, "SECTION", ["ARTICLE"]);
              if (i) {
                  var r = i.parentElement;
                  if (function() {
                      for (var e = r.children, t = e.length, n = 0; n < t; ++n) {
                          var a = e[n],
                              l = a.tagName;
                          if (a !== i && ("SECTION" === l || "HEADER" === l))
                              return !0
                      }
                      return !1
                  }() && (/\barticleBody\b/.test(r.getAttribute("itemprop")) || "MAIN" === r.tagName || "main" === r.getAttribute("role") || "ARTICLE" === r.tagName || r === this.contentDocument.body || r.classList.contains("entry-content")))
                      return void (this.article.element = r)
              }
              const N = /intro/i,
                  T = /body|content/i;
              if (e = this.article.element, N.test(e.className) && e.nextElementSibling && T.test(e.nextElementSibling.className) || T.test(e.className) && e.previousElementSibling && N.test(e.previousElementSibling.className))
                  return void (this.article.element = e.parentElement);
              if ("ARTICLE" !== e.tagName) {
                  var a = e.parentElement.closest("*[itemprop='articleBody']");
                  if (a && a.parentElement.closest(SchemaDotOrgArticleContainerSelector))
                      return void (this.article.element = a)
              }
              var l = e.closest("article");
              if (l) {
                  e = unwrappedArticleContentElement(e);
                  var o = elementDepth(e);
                  "P" !== e.tagName || e.className || (e = e.parentElement, o--);
                  var s;
                  e.classList.length ? (s = elementsMatchingClassesInClassListIgnoringCommonLayoutClassNames(e.classList, this.contentDocument), 1 === s.length && (s = elementsMatchingClassesInClassListIgnoringClassesWithNumericSuffix(e.classList, this.contentDocument))) : s = e.parentElement.children;
                  for (var c = s.length, m = 0; m < c; ++m) {
                      var d = s[m];
                      if (e !== d && o === elementDepth(d) && (isElementVisible(d) && !d.querySelector("article") && Object.keys(e.dataset).join() === Object.keys(d.dataset).join() && dominantFontFamilyAndSizeForElement(e) === dominantFontFamilyAndSizeForElement(d)))
                          return void (this.article.element = l)
                  }
              }
              if (e = this.article.element, !e.getAttribute("id") && e.className) {
                  var h = e.tagName,
                      u = e.className,
                      g = e.parentElement;
                  if (g)
                      for (var f = g.children, m = 0, p = f.length; m < p; ++m) {
                          var E = f[m];
                          if (E !== e && (E.tagName === h && E.className === u)) {
                              var v = CandidateElement.candidateIfElementIsViable(E, this.contentDocument, !0);
                              if (v && !(v.finalScore() < ReaderMinimumScore))
                                  return void (this.article.element = g)
                          }
                      }
              }
          }
      }
  },
  findArticleBySearchingWhitelist: function() {
      var e,
          t = this.contentDocument;
      return findArticleNodeSelectorsInWhitelistForHostname(t.location.hostname, function(n) {
          var i = t.querySelectorAll(n);
          if (1 === i.length)
              return e = new CandidateElement(i[0], t), !0
      }), e
  },
  articleNode: function(e) {
      return this.didSearchForArticleNode || (this.article = this.findArticleBySearchingWhitelist(), this.article || (this.article = this.findArticleBySearchingAllElements()), this.article || (this.article = this.findArticleByVisualExamination()), this.article || (this.article = this.findArticleFromMetadata()), !this.article && e && (this.article = this.findArticleBySearchingAllElements(!0)), this.adjustArticleNodeUpwardIfNecessary(), this.article && (this.article.element = unwrappedArticleContentElement(this.article.element)), this.didSearchForArticleNode = !0, this.article && this.articleIsLTR()), this.article ? this.article.element : null
  },
  extraArticleNode: function() {
      return this.didSearchForArticleNode || this.articleNode(), this.didSearchForExtraArticleNode || (this.extraArticle = this.findExtraArticle(), this.didSearchForExtraArticleNode = !0), this.extraArticle ? this.extraArticle.element : null
  },
  cacheWindowScrollPosition: function() {
      this._cachedScrollY = window.scrollY, this._cachedScrollX = window.scrollX
  },
  contentTextStyle: function() {
      return this._cachedContentTextStyle ? this._cachedContentTextStyle : (this._cachedContentTextStyle = contentTextStyleForNode(this.contentDocument, this.articleNode()), this._cachedContentTextStyle || (this._cachedContentTextStyle = getComputedStyle(this.articleNode())), this._cachedContentTextStyle)
  },
  commaCountIsLessThan: function(e, t) {
      for (var n = 0, i = e.textContent, r = -1; n < t && (r = i.indexOf(",", r + 1)) >= 0;)
          n++;
      return n < t
  },
  calculateLinkDensityForPruningElement: function(e, t) {
      var n = removeWhitespace(e.textContent).length;
      if (!n)
          return 0;
      for (var i = this.article.element, r = function() {
              for (var t = e.originalElement; t && t !== i; t = t.parentElement)
                  if ("none" !== getComputedStyle(t).float)
                      return t;
              return null
          }(), a = e.getElementsByTagName("a"), l = 0, o = a.length, s = 0; s < o; ++s) {
          var c = a[s];
          !r && c.href && t && t === dominantFontFamilyAndSizeForElement(c.originalElement) || (l += removeWhitespace(c.textContent).length)
      }
      return l / n
  },
  shouldPruneElement: function(e, t, n) {
      const i = .33,
          r = .5,
          a = .2,
          l = 25,
          o = 4e4;
      var s = e.tagName;
      if (!e.parentElement)
          return !1;
      if (t.classList.contains("footnotes"))
          return !1;
      if (e.querySelector(".tweet-wrapper"))
          return !1;
      if ("FIGURE" === e.parentElement.tagName && e.querySelector("img"))
          return !1;
      if (e instanceof HTMLIFrameElement)
          return shouldPruneIframe(e, this.contentDocument);
      if ("OBJECT" !== s && "EMBED" !== s && "CANVAS" !== s) {
          for (var c = !1, m = e.childNodes.length, d = 0; d < m; ++d) {
              var h = e.childNodes[d],
                  u = h.nodeType;
              if (u === Node.ELEMENT_NODE || u === Node.TEXT_NODE && !isNodeWhitespace(h)) {
                  c = !0;
                  break
              }
          }
          if (!c) {
              if ("P" === s) {
                  var g = e.previousSibling,
                      f = e.nextSibling;
                  if (g && g.nodeType === Node.TEXT_NODE && !isNodeWhitespace(g) && f && f.nodeType === Node.TEXT_NODE && !isNodeWhitespace(f))
                      return !1
              }
              return !0
          }
          if ("P" === s)
              return !1
      }
      if ("CANVAS" === s)
          return window.innerWidth === t.width && window.innerHeight === t.height || (!(!ProgressiveLoadingRegex.test(t.className) || "IMG" !== t.nextElementSibling.tagName) || (!!canvasElementHasNoUserVisibleContent(t) || "CUFON" === e.parentNode.tagName));
      if (e.closest("figure") && e.querySelector("picture"))
          return !1;
      var p = 0;
      if (t) {
          if (VeryNegativeClassNameRegEx.test(t.className))
              return !0;
          var E = t.className,
              v = t.getAttribute("id");
          PositiveRegEx.test(E) && p++, PositiveRegEx.test(v) && p++, NegativeRegEx.test(E) && p--, NegativeRegEx.test(v) && p--
      }
      let N = this.isMediaWikiPage();
      if (p < 0 && !N)
          return !0;
      if (elementIsProtected(e))
          return !1;
      if ("UL" === s || "OL" === s) {
          if (t.querySelector("iframe") && t.querySelector("script"))
              return !0;
          var T = t.children,
              A = T.length;
          if (!A && !/\S/.test(e.innerText))
              return !0;
          for (var y = 0, S = 0, d = 0; d < A; ++d) {
              var b = T[d];
              if (SharingRegex.test(b.className))
                  y++;
              else {
                  var x = b.children;
                  1 === x.length && SharingRegex.test(x[0].className) && y++
              }
              NegativeRegEx.test(T[d].className) && S++
          }
          return y / A >= MinimumRatioOfListItemsBeingRelatedToSharingToPruneEntireList || S / A >= MinimumRatioOfListItemsBeingRelatedToSharingToPruneEntireList
      }
      if ("OBJECT" === s) {
          var C = e.querySelector("embed[src]"),
              I = C ? anchorForURL(C.src, this.contentDocument) : null;
          if (I && hostnameMatchesHostKnownToContainEmbeddableMedia(I.hostname))
              return !1;
          var D = e.getAttribute("data");
          return !(I = D ? anchorForURL(D, this.contentDocument) : null) || !hostnameMatchesHostKnownToContainEmbeddableMedia(I.hostname)
      }
      if (1 === e.childElementCount) {
          var L = e.firstElementChild;
          if ("A" === L.tagName)
              return !1;
          if ("SPAN" === L.tagName && "converted-anchor" === L.className && nearestAncestorElementWithTagName(L, "TABLE"))
              return !1
      }
      var M = e.getElementsByTagName("img"),
          R = M.length;
      if (R) {
          for (var F = 0, d = 0; d < R; ++d) {
              var P = M[d].originalElement;
              if (isElementVisible(P)) {
                  var B = cachedElementBoundingRect(P);
                  F += B.width / R * (B.height / R)
              }
          }
          if (F > o)
              return !1
      }
      if (!this.commaCountIsLessThan(e, 10))
          return !1;
      var _ = e.getElementsByTagName("p").length,
          w = e.getElementsByTagName("br").length,
          O = _ + Math.floor(w / 2);
      if (R > O && "TABLE" !== s)
          return !0;
      if (!e.closest("table") && !e._originalElementDepthInCollapsedArea && !N) {
          if (e.getElementsByTagName("li").length > O && dominantFontFamilyAndSizeForElement(t.querySelector("li")) !== n)
              return !0;
          if (e.textContent.length < l && 1 !== R)
              return !0;
          let i = this.calculateLinkDensityForPruningElement(e, n);
          if (p >= 1 && i > r)
              return !0;
          if (p < 1 && i > a)
              return !0
      }
      if (e.getElementsByTagName("input").length / O > i)
          return !0;
      if (e.querySelector("embed"))
          return !0;
      if ("TABLE" === s) {
          if (removeWhitespace(e.innerText).length <= .5 * removeWhitespace(t.innerText).length)
              return !0;
          if (N && t.classList.contains("toc"))
              return !0
      }
      return !1
  },
  wordCountIsLessThan: function(e, t) {
      for (var n = 0, i = e.textContent, r = -1; (r = i.indexOf(" ", r + 1)) >= 0 && n < t;)
          n++;
      return n < t
  },
  leadingMediaIsAppropriateWidth: function(e) {
      return !(!this.article || !e) && e.getBoundingClientRect().width >= this.article.element.getBoundingClientRect().width - ToleranceForLeadingMediaWidthToArticleWidthForFullWidthPresentation
  },
  newDivFromNode: function(e) {
      var t = this.contentDocument.createElement("div");
      return e && (t.innerHTML = e.innerHTML), t
  },
  headerElement: function() {
      if (!this.article)
          return null;
      var e = this.article.element.previousElementSibling;
      if (e && "HEADER" === e.tagName)
          return e;
      var t = this._articleTitleElement;
      if (!t)
          return null;
      var n = t.parentElement;
      if (n && "HEADER" === n.tagName && !this.article.element.contains(n))
          for (var i = n.querySelectorAll("img"), r = i.length, a = 0; a < r; ++a) {
              var l = i[a],
                  o = cachedElementBoundingRect(l);
              if (o.width >= MainImageMinimumWidthAndHeight && o.height >= MainImageMinimumWidthAndHeight)
                  return n
          }
      return null
  },
  adoptableLeadingMedia: function() {
      if (!this.article || !this._leadingMediaElement || !this.leadingMediaIsAppropriateWidth(this._leadingMediaElement))
          return null;
      var e = this._leadingMediaElement.closest("figure");
      if (e)
          return this.cleanArticleNode(e, e.cloneNode(!0), CleaningType.LeadingMedia, !0);
      if ("IMG" !== this._leadingMediaElement.tagName)
          return this.cleanArticleNode(this._leadingMediaElement, this._leadingMediaElement.cloneNode(!0), CleaningType.LeadingMedia, !0);
      const t = 5,
          n = /credit/,
          i = /caption/,
          r = /src|alt/;
      var a = this._leadingMediaElement.parentNode,
          l = null,
          o = null,
          s = a.children.length;
      if ("DIV" === a.tagName && s > 1 && s < t)
          for (var c = a.cloneNode(!0).querySelectorAll("p, div"), m = c.length, d = 0; d < m; ++d) {
              var h = c[d];
              n.test(h.className) ? l = h.cloneNode(!0) : i.test(h.className) && (o = h.cloneNode(!0))
          }
      for (var u = this._leadingMediaElement.cloneNode(!1), g = attributesForElement(u), d = 0; d < g.length; ++d) {
          var f = g[d].nodeName;
          r.test(f) || (u.removeAttribute(f), d--)
      }
      var p = this.contentDocument.createElement("div");
      if (p.className = "leading-image", p.appendChild(u), l) {
          var E = this.newDivFromNode(l);
          E.className = "credit", p.appendChild(E)
      }
      if (o) {
          var v = this.newDivFromNode(o);
          v.className = "caption", p.appendChild(v)
      }
      return p
  },
  articleBoundingRect: function() {
      return this._articleBoundingRect ? this._articleBoundingRect : (this._articleBoundingRect = cachedElementBoundingRect(this.article.element), this._articleBoundingRect)
  },
  adoptableArticle: function(e) {
      if (this._adoptableArticle)
          return this._adoptableArticle.cloneNode(!0);
      clearCachedElementBoundingRects(), this.cacheWindowScrollPosition();
      var t = this.articleNode(e);
      if (this._adoptableArticle = t ? t.cloneNode(!0) : null, !this._adoptableArticle)
          return this._adoptableArticle;
      if (this._adoptableArticle = this.cleanArticleNode(t, this._adoptableArticle, CleaningType.MainArticleContent, !1), "P" === this._adoptableArticle.tagName) {
          var n = document.createElement("div");
          n.appendChild(this._adoptableArticle), this._adoptableArticle = n
      }
      var i = this.extraArticleNode();
      if (i) {
          var r = this.cleanArticleNode(i, i.cloneNode(!0), CleaningType.MainArticleContent, !0);
          r && (this.extraArticle.isPrepended ? this._adoptableArticle.insertBefore(r, this._adoptableArticle.firstChild) : this._adoptableArticle.appendChild(r));
          var a = cachedElementBoundingRect(this.article.element),
              l = cachedElementBoundingRect(this.extraArticle.element),
              o = {
                  top: Math.min(a.top, l.top),
                  right: Math.max(a.right, l.right),
                  bottom: Math.max(a.bottom, l.bottom),
                  left: Math.min(a.left, l.left)
              };
          o.width = o.right - o.left, o.height = o.bottom - o.top, this._articleBoundingRect = o
      }
      this._articleTextContent = this._adoptableArticle.innerText;
      var s = this.headerElement();
      if (this._leadingMediaElement && (!s || !s.contains(this._leadingMediaElement))) {
          var c = this.adoptableLeadingMedia();
          c && this._adoptableArticle.insertBefore(c, this._adoptableArticle.firstChild)
      }
      var m = !!s;
      if (m && i && (i === s && (m = !1), m)) {
          var d = i.compareDocumentPosition(s);
          (d & Node.DOCUMENT_POSITION_CONTAINS || d & Node.DOCUMENT_POSITION_CONTAINED_BY) && (m = !1)
      }
      if (m) {
          var h = this.cleanArticleNode(s, s.cloneNode(!0), CleaningType.MainArticleContent, !0);
          h && this._adoptableArticle.insertBefore(h, this._adoptableArticle.firstChild)
      }
      return this._adoptableArticle
  },
  elementPinToEdge: function(e) {
      const t = {
          AREA: 1,
          BR: 1,
          CANVAS: 1,
          EMBED: 1,
          FRAME: 1,
          HR: 1,
          IMG: 1,
          INPUT: 1
      };
      if (window.scrollY < 120)
          return null;
      var n = cachedElementBoundingRect(e),
          i = e.ownerDocument.elementFromPoint((n.left + n.right) / 2, 0);
      i && i.tagName in t && (i = i.parentElement);
      for (var r = i; r && r !== e;)
          r = r.parentNode;
      return r ? i : null
  },
  dominantContentSelectorAndDepth: function(e) {
      const t = 2;
      var n = {},
          i = {};
      walkElementSubtree(e, t, function(e, t) {
          if (isElementVisible(e)) {
              var r = selectorForElement(e) + " | " + t;
              i[r] ? i[r] += 1 : (i[r] = 1, n[r] = e)
          }
      });
      var r,
          a = arrayOfKeysAndValuesOfObjectSortedByValueDescending(i);
      switch (a.length) {
      case 0:
          break;
      case 1:
          r = a[0].key;
          break;
      default:
          var l = a[0];
          l.value > a[1].value && (r = l.key)
      }
      if (!r)
          return null;
      var o = n[r];
      return {
          selector: selectorForElement(o),
          depth: depthOfElementWithinElement(o, e)
      }
  },
  functionToPreventPruningElementDueToInvisibility: function() {
      return functionToPreventPruningDueToInvisibilityInWhitelistForHostname(this.contentDocument.location.hostname) || function() {
              return !1
          }
  },
  cleanArticleNode: function(e, t, n, i) {
      function r(e) {
          E += e, v && (v += e), N && (N += e), T && (T += e), A && (A += e), y && (y += e)
      }
      function a() {
          1 === v && (v = 0), 1 === N && (N = 0), 1 === T && (T = 0), 1 === A && (A = 0), 1 === y && (y = 0)
      }
      function l() {
          const t = .8;
          var n = cachedElementBoundingRect(e);
          if (0 === n.width || 0 === n.height)
              return !0;
          var i,
              r = childrenWithParallelStructure(e),
              a = r.length;
          if (a) {
              i = [];
              for (var l = 0; l < a; ++l) {
                  var o = r[l];
                  if ("none" === getComputedStyle(o).float)
                      for (var s = o.children, c = s.length, m = 0; m < c; ++m)
                          i.push(s[m]);
                  else
                      i.push(o)
              }
          } else
              i = e.children;
          for (var d = i.length, h = 0, l = 0; l < d; ++l) {
              var u = i[l];
              "none" !== getComputedStyle(u).float && (h += u.innerText.length)
          }
          return h / e.innerText.length > t
      }
      function o(t) {
          return !(cachedElementBoundingRect(t).height > 50) && (!!{
                  UL: 1,
                  LI: 1,
                  NAV: 1
              }[t.tagName] || t.parentElement === e && !t.nextElementSibling)
      }
      function s(e, t) {
          return !(cachedElementBoundingRect(e).height > .9 * cachedElementBoundingRect(t).height)
      }
      function c(e, t) {
          t && z && !e.matches(HeaderElementsSelector) && ((t > 1.4 * z || G.test(S.className) && t > 1.1 * z) && !e.closest(".pullquote") && (e.classList.add("pullquote"), e.classList.contains("float") || (e.style.width = null, cleanStyleAndClassList(e))))
      }
      function m(e, t) {
          for (var n = e[t]; n; n = n[t])
              if (!isNodeWhitespace(n) && n.nodeType !== Node.COMMENT_NODE)
                  return !1;
          return !0
      }
      const d = {
              FORM: 1,
              SCRIPT: 1,
              STYLE: 1,
              LINK: 1,
              BUTTON: 1,
              EMBED: 1
          },
          h = {
              DIV: 1,
              TABLE: 1,
              OBJECT: 1,
              UL: 1,
              CANVAS: 1,
              P: 1,
              ASIDE: 1,
              SECTION: 1,
              FOOTER: 1,
              NAV: 1,
              OL: 1,
              MENU: 1,
              svg: 1
          },
          u = {
              I: 1,
              EM: 1
          },
          g = {
              B: 1,
              STRONG: 1,
              H1: 1,
              H2: 1,
              H3: 1,
              H4: 1,
              H5: 1,
              H6: 1
          },
          f = /lightbox/i;
      var p = [],
          E = 0,
          v = 0,
          N = 0,
          T = 0,
          A = 0,
          y = 0,
          S = e,
          b = S.ownerDocument.defaultView,
          x = t,
          C = this.articleTitle(),
          I = this._articleTitleElement,
          D = (this.articleSubhead(), this._articleSubheadElement),
          L = I && cachedElementBoundingRect(I).top > cachedElementBoundingRect(e).bottom,
          M = this.elementPinToEdge(e),
          R = null,
          F = isElementVisible(e),
          P = new Set([I, D]),
          B = new Set;
      if (n === CleaningType.MainArticleContent) {
          this.updateArticleBylineAndDateElementsIfNecessary();
          var _ = this.articleBylineElement();
          _ && B.add(_);
          var w = this.articleDateElement();
          w && B.add(w)
      }
      var O = this.dominantContentSelectorAndDepth(e),
          k = l(),
          q = new Set;
      this.previouslyDiscoveredPageURLStrings.forEach(function(e) {
          q.add(e)
      });
      var W = this.nextPageURL();
      W && q.add(W);
      var U = null;
      this._articleTitleElement && (U = cachedElementBoundingRect(this._articleTitleElement));
      var H = this.functionToPreventPruningElementDueToInvisibility(),
          V = dominantFontFamilyAndSizeForElement(e),
          z = dominantFontSizeInPointsFromFontFamilyAndSizeString(V);
      const G = /pull(ed)?quote/i;
      for (var j = [], Y = [], X = [], K = [], J = []; S;) {
          var Q = null,
              $ = x.tagName,
              Z = !1,
              ee = elementLooksLikeDropCap(S);
          if (x.originalElement = S, S === M && (R = x), !y && elementAppearsToBeCollapsed(S) && (y = 1), $ in d && (Q = x), !Q && S !== e && P.has(S) ? Q = x : !Q && S !== e && B.has(S) ? (x.parentElementBeforePruning = x.parentElement, Q = x, j.push(x)) : elementIsAHeader(x) && previousLeafElementForElement(S) === I && x.classList.add("protected"), "TWITTER-WIDGET" === $ && x.classList.add("protected"), !Q && ("H1" === $ || "H2" === $)) {
              if (S.offsetTop - e.offsetTop < HeaderMinimumDistanceFromArticleTop) {
                  var te = trimmedInnerTextIgnoringTextTransform(S),
                      ne = te.length * HeaderLevenshteinDistanceToLengthRatio;
                  levenshteinDistance(C, te) <= ne && (Q = x)
              }
          }
          if (Q || this.isMediaWikiPage() && /editsection|icon-edit|edit-page|mw-empty-elt/.test(S.className) && (Q = x), "VIDEO" === $)
              if (x.getAttribute("src")) {
                  x.classList.add("protected");
                  var ie = cachedElementBoundingRect(S);
                  x.setAttribute("width", ie.width), x.setAttribute("height", ie.height), x.removeAttribute("style");
                  const e = S.hasAttribute("autoplay") && S.hasAttribute("muted") && S.hasAttribute("loop");
                  e ? x.setAttribute("data-reader-silent-looped-animation", "") : (x.setAttribute("controls", !0), x.removeAttribute("autoplay"), x.removeAttribute("preload"))
              } else
                  Q = x;
          var re;
          if (Q || (re = getComputedStyle(S)), !Q && ("DIV" === $ || "SPAN" === $) && LazyLoadRegex.test(S.className) && (!S.innerText || S.previousElementSibling && "NOSCRIPT" === S.previousElementSibling.tagName)) {
              var ae = lazyLoadingImageURLForElement(x, S.className);
              if (ae) {
                  var le = this.contentDocument.createElement("img");
                  le.setAttribute("src", ae), x.parentNode.replaceChild(le, x), x = le, x.originalElement = S, $ = x.tagName, Q = x, x.classList.add("protected")
              }
          }
          if (!Q && "DIV" === $ && x.parentNode) {
              var oe = S.querySelectorAll("a, blockquote, dl, div, img, ol, p, pre, table, ul"),
                  se = v || "none" !== re.float,
                  ce = null;
              if (se || oe.length ? elementIndicatesItIsASchemaDotOrgImageObject(S) && !x.querySelector("figure, .auxiliary") ? ce = "figure" : ee && (ce = "span") : ce = "p", ce) {
                  for (var me = x.parentNode, de = this.contentDocument.createElement(ce); x.firstChild;) {
                      var he = x.firstChild;
                      de.appendChild(he)
                  }
                  me.replaceChild(de, x), R === x && (R = de), x = de, x.originalElement = S, $ = x.tagName
              }
          }
          if (S.dataset.mathml && S.querySelector("math") && X.push(x), !Q && x.parentNode && (h[$] || x instanceof HTMLIFrameElement) && (x._originalElementDepthInCollapsedArea = y, p.push(x)), Q || (isElementPositionedOffScreen(S) ? Q = x : S === e || v || "none" === re.float || k || !(cachedElementBoundingRect(S).height >= FloatMinimumHeight || S.childElementCount > 1) || (v = 1)), !Q) {
              if (sanitizeElementByRemovingAttributes(x), n === CleaningType.MetadataContent)
                  if ("|" === x.innerText)
                      x.innerText = "", x.classList.add("delimiter");
                  else if ("TIME" === x.tagName) {
                      var ue = x.previousElementSibling;
                      if (ue && "SPAN" === ue.tagName && !ue.classList.contains("delimiter")) {
                          var ge = this.contentDocument.createElement("span");
                          ge.classList.add("delimiter"), x.before(ge)
                      }
                  } else
                      "FIGURE" === $ && (Q = x);
              if ("both" === re.clear && x.classList.add("clear"), "UL" === $ || "OL" === $ || "MENU" === $) {
                  if (U && !y && cachedElementBoundingRect(S).top < U.top)
                      Q = x;
                  else if ("none" === re["list-style-type"] && "none" === re["background-image"]) {
                      for (var fe = S.children, pe = fe.length, Ee = !0, ve = 0; ve < pe; ++ve) {
                          var Ne = fe[ve],
                              Te = getComputedStyle(Ne);
                          if ("none" !== Te["list-style-type"] || 0 !== parseInt(Te["-webkit-padding-start"])) {
                              Ee = !1;
                              break
                          }
                          var Ae = getComputedStyle(Ne, ":before").content;
                          const e = /\u2022|\u25e6|\u2023|\u2219|counter/;
                          if (e.test(Ae)) {
                              Ee = !1;
                              break
                          }
                      }
                      Ee && x.classList.add("list-style-type-none")
                  }
                  if (S.querySelector("code")) {
                      const e = /monospace|menlo|courier/i;
                      var ye = dominantFontFamilyAndSizeForElement(S);
                      e.test(ye) && (x.classList.add("code-block"), x.classList.add("protected"))
                  }
              }
              if (T || "normal" === re.fontStyle || ($ in u || x.style && (x.style.fontStyle = re.fontStyle), T = 1), !A && "normal" !== re.fontWeight) {
                  if (!($ in g)) {
                      var Se = parseInt(re.fontWeight),
                          be = null;
                      isNaN(Se) ? be = re.fontWeight : Se <= 400 || Se >= 500 && (be = "bold"), be && x.style && (x.style.fontWeight = be)
                  }
                  A = 1
              }
              if (v && "SECTION" !== $ && s(S, e) || "ASIDE" === $) {
                  var ye = dominantFontFamilyAndSizeForElement(S),
                      xe = dominantFontSizeInPointsFromFontFamilyAndSizeString(ye),
                      Ce = ye && ye === V;
                  if (1 !== v || ee || (cachedElementBoundingRect(S).width <= MaximumFloatWidth ? x.setAttribute("class", "auxiliary float " + re.float) : Ce || x.classList.add("auxiliary")), x.closest(".auxiliary") && S.style) {
                      var Ie = S.style.getPropertyValue("width");
                      if ("table" === re.display && /%/.test(Ie) && parseInt(Ie) < 2)
                          x.style.width = re.width;
                      else if (Ie)
                          x.style.width = Ie;
                      else {
                          var De = b.getMatchedCSSRules(S, "", !0);
                          if (De)
                              for (var Le = De.length, ve = Le - 1; ve >= 0; --ve) {
                                  Ie = De[ve].style.getPropertyValue("width");
                                  var Me = parseInt(Ie);
                                  if (Ie && (isNaN(Me) || Me > 0)) {
                                      x.style.width = Ie;
                                      break
                                  }
                              }
                      }
                      1 !== v || Ie || (x.style.width = cachedElementBoundingRect(S).width + "px")
                  }
                  ee || c(x, xe)
              }
              if ("TABLE" === $)
                  N || (N = 1);
              else if ("IMG" === $) {
                  var ae = lazyLoadingImageURLForElement(x, S.className);
                  if (ae) {
                      x.setAttribute("src", ae);
                      var Re = !!x.closest("figure");
                      if (!Re)
                          for (var Fe = attributesForElement(S), Pe = Fe.length, ve = 0; ve < Pe; ++ve)
                              if (f.test(Fe[ve].nodeName)) {
                                  Re = !0;
                                  break
                              }
                      Re && x.classList.add("protected"), S.hasAttribute("data-srcset") && x.setAttribute("srcset", S.getAttribute("data-srcset")), Z = !0
                  }
                  x.removeAttribute("border"), x.removeAttribute("hspace"), x.removeAttribute("vspace");
                  var Be = x.getAttribute("align");
                  if (x.removeAttribute("align"), "left" !== Be && "right" !== Be || (x.classList.add("float"), x.classList.add(Be)), !v && !Z) {
                      var _e = cachedElementBoundingRect(S),
                          we = _e.width,
                          Oe = _e.height;
                      hasClassMatchingRegexp(S, ProgressiveLoadingRegex) && S.nextElementSibling && "IMG" === S.nextElementSibling.tagName ? Q = x : imageIsContainedByContainerWithImageAsBackgroundImage(S) ? x.classList.add("protected") : 1 === we && 1 === Oe ? Q = x : U && Oe < MinimumHeightForImagesAboveTheArticleTitle && _e.bottom < U.top ? Q = x : we < ImageSizeTiny && Oe < ImageSizeTiny && x.setAttribute("class", "reader-image-tiny")
                  }
                  if (n === CleaningType.MetadataContent) {
                      var _e = cachedElementBoundingRect(S);
                      (_e.width > MaximumWidthOrHeightOfImageInMetadataSection || _e.height > MaximumWidthOrHeightOfImageInMetadataSection) && (Q = x)
                  }
              } else if ("FONT" === $)
                  x.removeAttribute("size"), x.removeAttribute("face"), x.removeAttribute("color");
              else if ("a" === normalizedElementTagName(x) && x.parentNode) {
                  let e,
                      t;
                  x instanceof HTMLAnchorElement ? (e = x.getAttribute("href"), t = HTMLAnchorElement) : x instanceof SVGAElement && (e = x.getAttribute("xlink:href"), t = SVGAElement);
                  let i = urlStringIsJavaScriptURL(e);
                  if (t === HTMLAnchorElement && "author" === S.getAttribute("itemprop"))
                      x.classList.add("protected");
                  else if (e && e.length && ("#" === e[0] || i)) {
                      const e = {
                          LI: 1,
                          SUP: 1
                      };
                      if (!N && !x.childElementCount && 1 === x.parentElement.childElementCount && !e[x.parentElement.tagName]) {
                          var ke = this.contentDocument.evaluate("text()", x.parentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                          ke.snapshotLength || (Q = x)
                      }
                      if (Q || t !== SVGAElement) {
                          if (!Q) {
                              var de = this.contentDocument.createElement("span");
                              if (1 === x.childElementCount && "IMG" === x.firstElementChild.tagName) {
                                  var qe = x.firstElementChild;
                                  qe.width > AnchorImageMinimumWidth && qe.height > AnchorImageMinimumHeight && de.setAttribute("class", "converted-image-anchor")
                              }
                              for (de.className || de.setAttribute("class", "converted-anchor"); x.firstChild;)
                                  de.appendChild(x.firstChild);
                              x.parentNode.replaceChild(de, x), x = de, x.originalElement = S, R === x && (R = de)
                          }
                      } else
                          x.removeAttribute("xlink:href")
                  } else if (AdvertisementHostRegex.test(x.host) && !x.innerText)
                      Q = x;
                  else if (n !== CleaningType.MetadataContent && I && !L && I.compareDocumentPosition(S) & document.DOCUMENT_POSITION_PRECEDING && cachedElementBoundingRect(S).top < cachedElementBoundingRect(I).top)
                      Y.push(x);
                  else {
                      var We = S.children;
                      1 === We.length && "IMG" === We[0].tagName && !S.innerText && anchorLooksLikeDownloadFlashLink(S) && (Q = x)
                  }
              } else if ("ASIDE" === $ || "BLOCKQUOTE" === $ || "Q" === $ || "DIV" === $ && G.test(S.className)) {
                  var ye = dominantFontFamilyAndSizeForElement(S),
                      xe = dominantFontSizeInPointsFromFontFamilyAndSizeString(ye);
                  ee || c(x, xe)
              } else if ("CITE" === $) {
                  var Ue = pseudoElementContent(S, "after");
                  if (Ue) {
                      var He = document.createElement("span");
                      He.innerText = Ue, x.after(He)
                  }
              } else
                  "PRE" === $ ? x.style.whiteSpace = re.whiteSpace : "SOURCE" === $ && S.hasAttribute("data-srcset") && (x.setAttribute("srcset", S.getAttribute("data-srcset")), x.classList.add("protected"))
          }
          if (re && F && !Z) {
              if (("none" === re.display || "visible" !== re.visibility || computedStyleIndicatesElementIsInvisibleDueToClipping(re)) && !y) {
                  !!O && (E === O.depth && selectorForElement(S) === O.selector) || H(S, e) || (Q = x)
              }
          }
          if (!Q && elementIsCommentBlock(S) && (Q = x), !Q && U && cachedElementBoundingRect(S).top < U.top && VeryLiberalCommentRegex.test(S.className) && x.parentElement && (Q = x), !Q && "A" === $ && q.has(S.href)) {
              for (var Ve, ze, Ge = S, je = x; (Ge = Ge.parentElement) && (je = je.parentElement);) {
                  const t = 10;
                  if (cachedElementBoundingRect(Ge).top - cachedElementBoundingRect(S).top > t)
                      break;
                  if (Ge === e)
                      break;
                  o(Ge) && (Ve = Ge, ze = je)
              }
              Ve && (Q = ze, S = Ve, x = ze, x.originalElement = S, $ = x.tagName), Ge = null, je = null, Ve = null, ze = null
          }
          !Q || Q.parentElement || i || (Q = null), "DIV" === $ ? K.push(x) : "ASIDE" === $ && J.push(x);
          var Ye = Q ? null : S.firstElementChild;
          if (Ye)
              S = Ye, x = x.firstElementChild, r(1);
          else {
              for (var Xe; S !== e && !(Xe = S.nextElementSibling);)
                  S = S.parentElement, x = x.parentElement, r(-1);
              if (S === e) {
                  if (Q && !elementIsProtected(Q))
                      if (Q.parentElement)
                          Q.remove();
                      else if (i)
                          return null;
                  break
              }
              S = Xe, x = x.nextElementSibling, a()
          }
          if (Q && !elementIsProtected(Q))
              if (Q.parentElement)
                  Q.remove();
              else if (i)
                  return null
      }
      for (let e of t.querySelectorAll("iframe")) {
          if (elementLooksLikeEmbeddedTweet(e.originalElement)) {
              var Ke = this.adoptableSimpleTweetFromTwitterElement(e);
              Ke && e.parentElement.replaceChild(Ke, e)
          }
          e.classList.add("protected"), e.setAttribute("sandbox", "allow-scripts allow-same-origin")
      }
      for (let e of t.querySelectorAll("twitter-widget")) {
          if (elementLooksLikeEmbeddedTweet(e.originalElement)) {
              var Ke = this.adoptableSimpleTweetFromTwitterElement(e);
              Ke && e.parentElement.replaceChild(Ke, e)
          }
          e.classList.add("protected")
      }
      for (var ve = p.length - 1; ve >= 0; --ve) {
          var Je = p[ve];
          Je.parentNode && this.shouldPruneElement(Je, Je.originalElement, V) && (R === Je && ((R = Je.nextElementSibling) || (R = Je.parentElement)), Je.remove()), delete Je._originalElementDepthInCollapsedArea
      }
      for (var Qe = Y.length, ve = 0; ve < Qe; ++ve)
          Y[ve].remove();
      for (var $e = t.querySelectorAll(".float"), ve = 0; ve < $e.length; ++ve) {
          var Ze = !1,
              et = $e[ve];
          if (!Ze) {
              var tt = et.querySelectorAll("a, span.converted-image-anchor"),
                  nt = et.querySelectorAll("span.converted-anchor");
              Ze = et.parentNode && nt.length > tt.length
          }
          if (!Ze) {
              var it = et.querySelectorAll("embed, object").length,
                  rt = et.originalElement.querySelectorAll("embed, object").length;
              !it && rt && (Ze = !0)
          }
          if (!Ze) {
              for (var at = et.originalElement.getElementsByTagName("img"), lt = at.length, ot = 0, st = 0; st < lt && (F && isElementVisible(at[st]) && ot++, !(ot > 1)); ++st)
                  ;
              if (1 === ot) {
                  et.getElementsByTagName("img").length || (Ze = !0)
              }
          }
          if (!Ze) {
              const e = "img, video, embed, iframe, object, svg";
              /\S/.test(et.innerText) || et.matches(e) || et.querySelector(e) || (Ze = !0)
          }
          Ze && (R === et && ((R = et.nextElementSibling) || (R = et.parentElement)), elementIsProtected(et) || et.remove())
      }
      for (var ct = t.querySelectorAll("br"), mt = ct.length, ve = mt - 1; ve >= 0; --ve) {
          var dt = ct[ve];
          dt.originalElement && "block" === getComputedStyle(dt.originalElement.parentElement).display && (m(dt, "nextSibling") || m(dt, "previousSibling")) && dt.remove()
      }
      if (i && !removeWhitespace(t.innerText).length && (n !== CleaningType.LeadingMedia || !t.querySelector("video, iframe, img")))
          return null;
      if (R) {
          var ht = document.createElement("div"),
              ut = R.originalElement.getBoundingClientRect(),
              gt = ut.height > 0 ? 100 * ut.top / ut.height : 0;
          ht.style.position = "relative", ht.style.top = Math.round(-gt) + "%", ht.setAttribute("id", "safari-reader-element-marker"), R.insertBefore(ht, R.firstChild)
      }
      for (var ft = {}, tt = t.querySelectorAll("a"), pt = tt.length, ve = 0; ve < pt; ++ve) {
          var Et = tt[ve],
              vt = Et.style.fontWeight;
          ft[vt] || (ft[vt] = []), ft[vt].push(Et)
      }
      for (var vt in ft) {
          var Nt = ft[vt],
              Tt = Nt.length;
          const e = .7;
          if (Tt > e * pt)
              for (var ve = 0; ve < Tt; ++ve) {
                  var Et = Nt[ve];
                  Et.style.fontWeight = null, Et.getAttribute("style") || Et.removeAttribute("style")
              }
      }
      for (var At = t.querySelectorAll(".protected"), yt = At.length, ve = 0; ve < yt; ++ve) {
          var Je = At[ve];
          Je.classList.remove("protected"), Je.classList.length || Je.removeAttribute("class")
      }
      for (var St = t.querySelectorAll("p.auxiliary"), bt = St.length, ve = 0; ve < bt; ++ve) {
          for (var xt = St[ve], Ct = [xt], It = xt.nextElementSibling; It && "P" === It.tagName && It.classList.contains("auxiliary");)
              Ct.push(It), It = It.nextElementSibling;
          var Dt = Ct.length;
          if (Dt > 1) {
              for (var st = 0; st < Dt; ++st) {
                  var Lt = Ct[st];
                  Lt.classList.remove("auxiliary"), Lt.style && (Lt.style.width = null), cleanStyleAndClassList(Lt)
              }
              ve += Dt - 1
          }
      }
      for (var Mt = K.length, ve = Mt - 1; ve >= 0; --ve) {
          var Rt = K[ve];
          Rt !== t && elementWouldAppearBetterAsFigureOrAuxiliary(Rt.originalElement, Rt) && changeElementType(Rt, "figure")
      }
      for (var Ft = J.length, ve = Ft - 1; ve >= 0; --ve) {
          var Pt = J[ve];
          Pt !== t && elementWouldAppearBetterAsFigureOrAuxiliary(Pt.originalElement, Pt) && Pt.classList.add("auxiliary")
      }
      const Bt = t.querySelectorAll("blockquote"),
          _t = Bt.length;
      for (var ve = 0; ve < _t; ++ve) {
          const e = Bt[ve],
              t = e.originalElement;
          t && this.convertBlockquoteTweetToSimpleTweetIfAppropriate(e, t)
      }
      for (var wt = j.length, ve = 0; ve < wt; ++ve) {
          var Ot = j[ve],
              kt = Ot.parentElementBeforePruning,
              qt = null,
              Wt = null;
          if (kt)
              var qt = depthOfElementWithinElement(kt, t),
                  Wt = selectorForElement(kt);
          var Ut = kt ? kt.closest("ul") : null;
          if (Ut)
              Ut.remove();
          else {
              const e = 40;
              kt && cachedElementBoundingRect(kt.originalElement).height < e && (!O || O.selector !== Wt || O.depth !== qt) ? kt.remove() : Ot.remove()
          }
      }
      for (var Ht = X.length, ve = 0; ve < Ht; ++ve) {
          var Vt = X[ve],
              zt = this.contentDocument.createElement("div");
          zt.innerHTML = Vt.dataset.mathml, Vt.parentNode.replaceChild(zt, Vt)
      }
      return t
  },
  convertBlockquoteTweetToSimpleTweetIfAppropriate: function(e, t) {
      const n = t.classList;
      if (n.contains("twitter-tweet") || n.contains("twitter-video")) {
          const n = t.getElementsByTagName("a"),
              i = n.length;
          if (!(i < 1)) {
              const t = n[i - 1];
              if ("twitter.com" === t.host) {
                  const n = lastPathComponentFromAnchor(t);
                  if (!isNaN(parseInt(n))) {
                      const t = this.contentDocument.createElement("div");
                      t.setAttribute("data-reader-tweet-id", n), t.classList.add("tweet-wrapper"), e.parentElement.replaceChild(t, e), e.classList.add("simple-tweet"), t.appendChild(e)
                  }
              }
          }
      }
  },
  adoptableSimpleTweetFromTwitterElement: function(e) {
      var t = function(e) {
          var t = this.contentDocument.createElement("div"),
              n = this.contentDocument.createTextNode(e);
          return t.appendChild(n), t.innerHTML
      }.bind(this);
      let n = null,
          i = e.originalElement;
      if (e instanceof HTMLIFrameElement ? n = i.contentDocument ? i.contentDocument.documentElement : null : "TWITTER-WIDGET" === e.tagName && (n = i.shadowRoot), !n)
          return null;
      var r = n.querySelector("[data-tweet-id].expanded") || n.querySelector("[data-tweet-id]");
      if (!r)
          return null;
      var a = this.contentDocument.createElement("div");
      a.classList.add("tweet-wrapper");
      var l = this.contentDocument.createElement("blockquote");
      l.classList.add("simple-tweet"), a.appendChild(l);
      var o = r.getAttribute("data-tweet-id");
      a.setAttribute("data-reader-tweet-id", o);
      var s = r.querySelector(".dateline"),
          c = r.querySelector('[data-scribe="element:screen_name"]'),
          m = r.querySelector('[data-scribe="element:name"]'),
          d = r.querySelector(".e-entry-title");
      if (!(s && c && m && d))
          return a;
      var h = "&mdash; " + t(m.innerText) + " (" + t(c.innerText) + ")",
          u = this.contentDocument.createElement("p");
      u.innerHTML = d.innerHTML, l.appendChild(u), l.insertAdjacentHTML("beforeend", h);
      var g = this.contentDocument.createElement("span");
      g.innerHTML = s.innerHTML, l.appendChild(g);
      for (var f = l.querySelectorAll("img.twitter-emoji"), p = f.length, E = 0; E < p; ++E) {
          var v = f[E],
              N = v.getAttribute("alt");
          if (N && N.length > 0) {
              var T = this.contentDocument.createElement("span");
              T.innerText = N, v.parentNode.replaceChild(T, v)
          }
      }
      for (var A = l.getElementsByTagName("*"), y = A.length, E = 0; E < y; ++E) {
          var e = A[E];
          "SCRIPT" === e.tagName ? e.remove() : sanitizeElementByRemovingAttributes(e)
      }
      return a
  },
  leadingVideoNode: function() {
      var e = this.leadingContentNodeWithSelector("video, iframe");
      return e && e.parentElement && !e.previousElementSibling && !e.nextElementSibling ? e.parentElement : null
  },
  leadingImageNode: function() {
      return this.leadingContentNodeWithSelector("figure img, img")
  },
  leadingContentNodeWithSelector: function(e) {
      const t = 250,
          n = .5,
          i = .9,
          r = 3;
      if (!this.article || !this.article.element)
          return null;
      for (var a = this.article.element, l = 0; l < r && a.parentNode; ++l) {
          a = a.parentNode;
          var o = a.querySelectorAll(e)[0];
          if (o && isElementVisible(o)) {
              var s = cachedElementBoundingRect(o);
              if (!(s.width >= window.innerWidth * i) && s.height < t)
                  continue;
              if (s.width < this._articleWidth * n)
                  continue;
              var c = this.article.element.compareDocumentPosition(o);
              if (!(c & Node.DOCUMENT_POSITION_PRECEDING) || c & Node.DOCUMENT_POSITION_CONTAINED_BY)
                  continue;
              var m = this.extraArticle ? this.extraArticle.element : null;
              if (m && this.article.element.compareDocumentPosition(m) & Node.DOCUMENT_POSITION_FOLLOWING && (c = m.compareDocumentPosition(o)) && (!(c & Node.DOCUMENT_POSITION_PRECEDING) || c & Node.DOCUMENT_POSITION_CONTAINED_BY))
                  continue;
              return o
          }
      }
      return null
  },
  pageImageURLFromMetadata: function(e) {
      var t = e["property:og:image"];
      if (t || (t = e["property:twitter:image"]), t || (t = e["property:twitter:image:src"]), t) {
          var n = anchorForURL(t, this.contentDocument);
          if (n) {
              var i = n.href;
              i && anchorIsHTTPFamilyProtocol(n) && (t = i)
          }
      }
      return t
  },
  mainImageNode: function() {
      var e = this.leadingImageNode();
      if (e)
          return e;
      if (this.article && this.article.element)
          for (var t = this.article.element.querySelectorAll("img"), n = t.length, i = 0; i < n; ++i) {
              var r = t[i],
                  a = r._cachedElementBoundingRect;
              if (a || (a = r.getBoundingClientRect()), a.width >= MainImageMinimumWidthAndHeight && a.height >= MainImageMinimumWidthAndHeight)
                  return r
          }
      return null
  },
  schemaDotOrgMetadataObject: function() {
      if (this._schemaDotOrgMetadataObject)
          return this._schemaDotOrgMetadataObject;
      var e = this.contentDocument.querySelectorAll("script[type='application/ld+json']"),
          t = e.length;
      try {
          for (var n = 0; n < t; ++n) {
              var i = e[n],
                  r = JSON.parse(i.textContent),
                  a = r["@context"];
              if ("https://schema.org" === a || "http://schema.org" === a)
                  return this._schemaDotOrgMetadataObject = r, r
          }
          return null
      } catch (e) {
          return null
      }
  },
  articleTitle: function() {
      var e = this.articleTitleInformation();
      return e ? e.titleText : ""
  },
  articleTitleInformation: function() {
      function e(e, t) {
          var n = e ? t.indexOf(e) : -1;
          return -1 !== n && (0 === n || n + e.length === t.length)
      }
      function t(e, t) {
          return e.host === t.host && e.pathname === t.pathname && e.hash === t.hash
      }
      function n(e) {
          return nearestAncestorElementWithTagName(e, "A") || e.querySelector("a")
      }
      if (this.articleNode()) {
          if (this._articleTitleInformation)
              return this._articleTitleInformation;
          const xe = /((article|post).*title|headline|instapaper_title|inside-head)/i,
              Ce = 500,
              Ie = 20,
              De = 8,
              Le = 1.1,
              Me = 1.25,
              Re = /header|title|headline|instapaper_title/i,
              Fe = 1.5,
              Pe = 1.8,
              Be = 1.5,
              _e = .6,
              we = 3,
              Oe = 1.5,
              ke = .8,
              qe = .8,
              We = 9,
              Ue = 1.5,
              He = /byline|author/i;
          var i = function(e, t) {
                  var n = this.contentFromUniqueMetadataSelector(e, t);
                  if (n) {
                      var i = this.articleTitleAndSiteNameFromTitleString(n);
                      i && (n = i.articleTitle)
                  }
                  return n
              }.bind(this),
              r = function() {
                  for (var e = this.articleNode(); e; e = e.parentElement)
                      if (elementIndicatesItIsASchemaDotOrgArticleContainer(e))
                          return e;
                  return null
              }.bind(this)(),
              a = r ? this.contentFromUniqueMetadataSelector(r, "meta[itemprop=headline]") : "",
              l = r ? this.contentFromUniqueMetadataSelector(r, "meta[itemprop=alternativeHeadline]") : "",
              o = this.contentDocument,
              s = o.location,
              c = o.title,
              m = i(o, "meta[property='og:title']"),
              d = this.contentFromUniqueMetadataSelector(o, "meta[property='og:site_name']"),
              h = i(o, "meta[name='twitter:title']"),
              u = i(o, "meta[name='sailthru.headline']"),
              g = this.schemaDotOrgMetadataObject(),
              f = g ? g.headline : null,
              p = this.articleNode(),
              E = cachedElementBoundingRect(p);
          this.extraArticleNode() && this.extraArticle.isPrepended && (E = cachedElementBoundingRect(this.extraArticleNode()));
          var v = E.left + E.width / 2,
              N = E.top,
              T = N;
          if (this._articleWidth = E.width, this._leadingMediaElement = this.leadingImageNode(), this._leadingMediaElement || (this._leadingMediaElement = this.leadingVideoNode()), this._leadingMediaElement) {
              T = (cachedElementBoundingRect(this._leadingMediaElement).top + N) / 2
          }
          var A = "h1, h2, h3, h4, h5, a:not(svg a), p, div, span",
              y = this.article.element.tagName;
          "DL" !== y && "DD" !== y || (A += ", dt");
          for (var S = [], b = o.querySelectorAll(A), x = b.length, C = 0; C < x; ++C) {
              var I = b[C],
                  D = I.tagName;
              if ("A" === D)
                  I.innerText === m && t(I, s) && (I.previousElementSibling || I.nextElementSibling ? S.push(I) : S.push(I.parentElement));
              else if ("DIV" === D || "SPAN" === D || "P" === D) {
                  if (hasClassMatchingRegexp(I, xe) || xe.test(I.getAttribute("id"))) {
                      var L = I.parentElement;
                      elementIsAHeader(L) || S.push(I)
                  }
              } else
                  S.push(I)
          }
          S = Array.prototype.slice.call(S, 0);
          const Ve = 2;
          for (var M = this.article.element, C = 0; C < Ve; ++C)
              M.parentElement && (M = M.parentElement);
          for (var R = M.querySelectorAll("a:not(svg a)"), C = 0, F = R.length; C < F; ++C) {
              var P = R[C];
              if (P.offsetTop > p.offsetTop + Ie)
                  break;
              if (t(P, s) && "#" !== P.getAttribute("href")) {
                  S.push(P);
                  break
              }
          }
          var B,
              _ = S.map(trimmedInnerTextIgnoringTextTransform),
              w = S.length,
              O = 0,
              k = [],
              q = [],
              W = [],
              U = [],
              H = [],
              V = [],
              z = [];
          const ze = {},
              Ge = e => {
                  const t = ze[e];
                  if (t)
                      return t;
                  const n = stringSimilarity(c, e);
                  ze[e] = n;
                  return n
              };
          for (var C = 0; C < w; ++C) {
              var G = S[C],
                  j = _[C];
              const e = {},
                  t = t => {
                      const n = e[t];
                      if (n)
                          return n;
                      const i = stringSimilarity(j, t);
                      e[t] = i;
                      return i
                  };
              let n = Ge(j);
              if (m) {
                  const e = t(m);
                  n += e, e > StringSimilarityToDeclareStringsNearlyIdentical && q.push(G)
              }
              if (h) {
                  const e = t(h);
                  n += e, e > StringSimilarityToDeclareStringsNearlyIdentical && W.push(G)
              }
              if (a) {
                  const e = t(a);
                  n += e, e > StringSimilarityToDeclareStringsNearlyIdentical && U.push(G)
              }
              if (l) {
                  const e = t(l);
                  n += e, e > StringSimilarityToDeclareStringsNearlyIdentical && H.push(G)
              }
              if (u) {
                  const e = t(u);
                  n += e, e > StringSimilarityToDeclareStringsNearlyIdentical && V.push(G)
              }
              if (f) {
                  const e = t(f);
                  n += e, e > StringSimilarityToDeclareStringsNearlyIdentical && z.push(G)
              }
              n === O ? k.push(G) : n > O && (O = n, k = [G])
          }
          if (1 === q.length ? (B = q[0], B.headerText = trimmedInnerTextIgnoringTextTransform(B)) : 1 === W.length ? (B = W[0], B.headerText = trimmedInnerTextIgnoringTextTransform(B)) : 1 === U.length ? (B = U[0], B.headerText = trimmedInnerTextIgnoringTextTransform(B)) : 1 === V.length ? (B = V[0], B.headerText = trimmedInnerTextIgnoringTextTransform(B)) : 1 === z.length && (B = z[0], B.headerText = trimmedInnerTextIgnoringTextTransform(B)), !B)
              for (var C = 0; C < w; ++C) {
                  var G = S[C];
                  if (isElementVisible(G)) {
                      var Y = cachedElementBoundingRect(G),
                          X = Y.left + Y.width / 2,
                          K = Y.top + Y.height / 2,
                          J = X - v,
                          Q = K - T,
                          $ = -1 !== q.indexOf(G),
                          Z = -1 !== W.indexOf(G),
                          ee = G.classList.contains("instapaper_title"),
                          te = /\bheadline\b/.test(G.getAttribute("itemprop")),
                          ne = -1 !== U.indexOf(G),
                          ie = -1 !== H.indexOf(G),
                          re = -1 !== V.indexOf(G),
                          ae = $ || Z || ee || te || ne || ie || re,
                          le = Math.sqrt(J * J + Q * Q),
                          oe = ae ? Ce : Math.max(Ce - le, 0),
                          j = _[C],
                          se = G.getAttribute("property");
                      if (se) {
                          var ce = /dc.title/i.exec(se);
                          if (ce && ce[0]) {
                              var me = this.contentDocument.querySelectorAll('*[property~="' + ce[0] + '"]');
                              if (1 === me.length) {
                                  B = G, B.headerText = j;
                                  break
                              }
                          }
                      }
                      if (!He.test(G.className)) {
                          if (!ae) {
                              if (le > Ce)
                                  continue;
                              if (X < E.left || X > E.right)
                                  continue
                          }
                          if (c && stringsAreNearlyIdentical(j, c))
                              oe *= we;
                          else if (e(j, c))
                              oe *= Oe;
                          else if (j.length < De)
                              continue;
                          if (j !== d || !m) {
                              var de = !1,
                                  he = n(G);
                              if (he) {
                                  if ("author" === he.getAttribute("rel"))
                                      continue;
                                  var ue = he.host === s.host,
                                      ge = he.pathname === s.pathname;
                                  if (ue && ge)
                                      oe *= Be;
                                  else {
                                      if (ue && nearestAncestorElementWithTagName(G, "LI"))
                                          continue;
                                      oe *= _e, de = !0
                                  }
                              }
                              var fe = fontSizeFromComputedStyle(getComputedStyle(G));
                              de || (oe *= fe / BaseFontSize), oe *= 1 + TitleCandidateDepthScoreMultiplier * elementDepth(G);
                              var pe = parseInt(this.contentTextStyle().fontSize);
                              parseInt(fe) > pe * Le && (oe *= Me), (Re.test(G.className) || Re.test(G.getAttribute("id"))) && (oe *= Fe);
                              var Ee = G.parentElement;
                              Ee && (Re.test(Ee.className) || Re.test(Ee.getAttribute("id"))) && (oe *= Fe), -1 !== k.indexOf(G) && (oe *= Pe);
                              for (var p = this.article.element, ve = G; ve && ve !== p; ve = ve.parentElement)
                                  if (SidebarRegex.test(ve.className)) {
                                      oe *= ke;
                                      break
                                  }
                              G.closest("li") && (oe *= qe), (!B || oe > B.headerScore) && (B = G, B.headerScore = oe, B.headerText = j)
                          }
                      }
                  }
              }
          B && domDistance(B, p, We + 1) > We && parseInt(getComputedStyle(B).fontSize) < Ue * pe && (B = null);
          var Ne;
          if (B) {
              this._articleTitleElement = B;
              var Te = B.headerText.trim();
              Ne = m && e(m, Te) ? m : c && e(c, Te) ? c : Te
          }
          Ne || (Ne = m && e(m, c) ? m : c);
          var Ae = null,
              ye = !1,
              Se = !1;
          if (B) {
              var he = n(B);
              he && (Ae = he.href, ye = "_blank" === he.getAttribute("target"), Se = he.host !== s.host || he.pathname !== s.pathname)
          }
          var be = {
              titleText: Ne,
              linkURL: Ae,
              linkIsTargetBlank: ye,
              linkIsForExternalPage: Se
          };
          return this._articleTitleInformation = be, be
      }
  },
  contentFromUniqueMetadataSelector: function(e, t) {
      var n = e.querySelectorAll(t);
      if (1 !== n.length)
          return null;
      var i = n[0];
      return i ? this.elementAttributesContainImproperQuote(i) ? null : i.content : null
  },
  elementAttributesContainImproperQuote: function(e) {
      for (var t = attributesForElement(e), n = t.length, i = 0; i < n; ++i)
          if (/['"]/.test(t[i].name))
              return !0;
      return !1
  },
  articleSubhead: function() {
      function e(e) {
          return elementIsAHeader(e) ? parseInt(/H(\d)?/.exec(e.tagName)[1]) : NaN
      }
      function t(e) {
          if (!e)
              return null;
          var t = e.content;
          return t ? t.trim() : null
      }
      const n = /author|kicker/i,
          i = /sub(head|title)|description|dec?k|abstract/i;
      if (this._articleSubhead)
          return this._articleSubhead;
      var r = this.articleNode();
      if (r) {
          var a = this._articleTitleElement;
          if (a) {
              var l = this.contentDocument,
                  o = l.location,
                  s = e(a),
                  c = cachedElementBoundingRect(a),
                  m = new Set,
                  d = l.querySelector("meta[property='og:description']"),
                  h = t(d);
              h && m.add(h);
              var u = l.querySelector("meta[name=description]"),
                  g = t(u);
              g && m.add(g);
              var f = this.schemaDotOrgMetadataObject();
              if (f) {
                  var p = f.description;
                  p && "string" == typeof p && m.add(p.trim())
              }
              var E,
                  v = this.contentFromUniqueMetadataSelector(l, "head meta.swiftype[name=dek]");
              v && (E = v);
              var N = [nextNonFloatingVisibleElementSibling(a), nextLeafElementForElement(a)];
              if (m.size)
                  for (var T = l.querySelectorAll(HeaderElementsSelector + ", *[itemprop=description]"), A = T.length, y = 0; y < A; ++y) {
                      var S = T[y];
                      m.has(S.innerText.trim()) && N.push(S)
                  }
              for (var b = N.length, y = 0; y < b; ++y) {
                  var x = N[y];
                  if (x && x !== r) {
                      var C = x.className;
                      if (!n.test(C)) {
                          var I = x.closest("a");
                          if (I) {
                              var D = I.host === o.host,
                                  L = I.pathname === o.pathname;
                              if (!D || !L)
                                  continue
                          }
                          var M = !1;
                          if (elementIsAHeader(x))
                              if (isNaN(s))
                                  M = !0;
                              else {
                                  var R = e(x);
                                  R - 1 === s && (M = !0)
                              }
                          if (!M && i.test(C) && (M = !0), !M && /\bdescription\b/.test(x.getAttribute("itemprop")) && (M = !0), !M && m.has(x.innerText) && (M = !0), !M && E && E === x.innerText && (M = !0), M || "summary" !== x.getAttribute("itemprop") || (M = !0), M) {
                              var F;
                              if ("META" === x.tagName) {
                                  var P = x.getAttribute("content");
                                  F = P ? P.trim() : "";
                                  var B = x.nextElementSibling;
                                  if (!B || trimmedInnerTextIgnoringTextTransform(B) !== F)
                                      continue;
                                  x = B
                              } else {
                                  if (cachedElementBoundingRect(x).top < (c.bottom + c.top) / 2)
                                      continue;
                                  F = trimmedInnerTextIgnoringTextTransform(x).trim()
                              }
                              if (F.length) {
                                  this._articleSubheadElement = x, this._articleSubhead = F;
                                  break
                              }
                          }
                      }
                  }
              }
              return this._articleSubhead
          }
      }
  },
  adoptableMetadataBlock: function() {
      function e(e) {
          function t(e, i) {
              if (e.nodeType === Node.TEXT_NODE)
                  return void (i === n.Left ? e.textContent = e.textContent.trimLeft() : i === n.Right ? e.textContent = e.textContent.trimRight() : e.textContent = e.textContent.trim());
              if (e.nodeType === Node.ELEMENT_NODE) {
                  var r = e.childNodes,
                      a = r.length;
                  if (0 !== a) {
                      if (1 === a)
                          return void t(r[0], i);
                      i !== n.Right && t(r[0], n.Left), i !== n.Left && t(r[a - 1], n.Right)
                  }
              }
          }
          const n = {
              Left: 1,
              Right: 2,
              Both: 3
          };
          t(e)
      }
      this.updateArticleBylineAndDateElementsIfNecessary();
      var t = this.articleBylineElement(),
          n = this.articleDateElement();
      if (!t && !n)
          return null;
      if (t && n) {
          var i = t.compareDocumentPosition(n);
          i & Node.DOCUMENT_POSITION_CONTAINS && (t = null), i & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = null), t === n && (n = null)
      }
      var r,
          a = this.contentDocument.createElement("div"),
          l = !1,
          o = !1;
      if (t) {
          var r = this.cleanArticleNode(t, t.cloneNode(!0), CleaningType.MetadataContent, !1);
          e(r), r.innerText.trim() && (l = !0, r.classList.add("byline"))
      }
      if (n) {
          var s = this.cleanArticleNode(n, n.cloneNode(!0), CleaningType.MetadataContent, !1);
          e(s), s.innerText.trim() && (o = !0, s.classList.add("date"))
      }
      if (l && a.appendChild(r), l && o) {
          var c = document.createElement("span");
          c.classList.add("delimiter"), a.appendChild(c)
      }
      return o && a.appendChild(s), a
  },
  articleBylineElement: function() {
      return this._articleBylineElement
  },
  findArticleBylineElement: function() {
      var e = this.findArticleBylineElementWithoutRejection();
      return e && ("FOOTER" === e.tagName || e.closest("figure")) ? null : e
  },
  findArticleBylineElementWithoutRejection: function() {
      function e(e) {
          if (!e.length)
              return null;
          e = e.filter(isElementVisible);
          for (var t = new Set, n = new Set, i = e.length, o = 0; o < i - 1; ++o) {
              var s = e[o],
                  c = e[o + 1];
              if (isElementVisible(s) && isElementVisible(c)) {
                  var m = s.parentElement;
                  m === c.parentElement && (m.contains(l) || (n.add(s.parentElement), t.add(s), t.add(c)))
              }
          }
          var d = new Set(e);
          n.forEach(function(e) {
              d.add(e)
          }), t.forEach(function(e) {
              d["delete"](e)
          }), e = [], d.forEach(function(t) {
              e.push(t)
          });
          var h,
              u = null;
          i = e.length;
          for (var o = 0; o < i; ++o) {
              var s = e[o];
              if (isElementVisible(s)) {
                  var g = cachedElementBoundingRect(s),
                      f = g.left + g.width / 2,
                      p = g.top + g.height / 2,
                      E = r - f,
                      v = a - p,
                      N = Math.sqrt(E * E + v * v);
                  (!u || N < h) && (u = s, h = N)
              }
          }
          return u
      }
      const t = "[itemprop='author'], a[rel='author']:not(svg a)",
          n = ".byline, .article-byline, .entry-meta, .author-name, .byline-dateline, .article-author, [itemprop='author'], a[rel='author']:not(svg a)";
      var i,
          r,
          a,
          l = this._articleSubheadElement || this._articleTitleElement;
      if (l)
          var i = l ? cachedElementBoundingRect(l) : null,
              r = i.left + i.width / 2,
              a = i.top + i.height / 2;
      var o = this.contentFromUniqueMetadataSelector(this.contentDocument, "head meta[name=author]");
      if (o || (o = this.contentFromUniqueMetadataSelector(this.contentDocument, "head meta[property=author]")), !o) {
          var s = this.schemaDotOrgMetadataObject();
          if (s) {
              var c = s.author;
              c && "object" == typeof c && (o = c.name)
          }
      }
      var m = this.article.element,
          d = m.querySelectorAll(n);
      if (1 === d.length)
          return d[0];
      var h = l ? l.nextElementSibling : null;
      if (h) {
          if (h.matches(n) || h.innerText === o || (h = h.querySelector(n)), h) {
              if (h.querySelector("li")) {
                  var u = h.querySelector(n);
                  u && (h = u)
              }
          }
          if (h)
              return h
      }
      for (var g = this.contentDocument.getElementsByTagName("a"), f = 0, p = g.length; f < p; ++f) {
          var E = g[f];
          if (trimmedInnerTextIgnoringTextTransform(E) === o)
              return E
      }
      var v = m.closest("article");
      if (l && v) {
          var N = Array.from(v.querySelectorAll(t)),
              T = e(N);
          if (T)
              return T;
          if (N = Array.from(v.querySelectorAll(n)), T = e(N))
              return T
      }
      var A = m.previousElementSibling;
      if (A) {
          var N = Array.from(A.querySelectorAll(t)),
              T = e(N);
          if (T)
              return T;
          if (N = Array.from(A.querySelectorAll(n)), T = e(N))
              return T
      }
      return null
  },
  articleDateElement: function() {
      return this._articleDateElement
  },
  findArticleDateElement: function() {
      function e(e) {
          for (var t = e; t && t !== a; t = t.parentElement)
              if (elementIsCommentBlock(t))
                  return !0;
          return !1
      }
      function t(t) {
          for (var n, i = null, r = t.length, a = 0; a < r; ++a) {
              var l = t[a];
              if (isElementVisible(l) && !e(l)) {
                  var o = cachedElementBoundingRect(l),
                      m = o.left + o.width / 2,
                      d = o.top + o.height / 2,
                      h = s - m,
                      u = c - d,
                      g = Math.sqrt(h * h + u * u);
                  (!i || g < n) && (i = l, n = g)
              }
          }
          return i
      }
      const n = /date/i,
          i = "time, .dateline, .entry-date";
      var r = this._articleSubheadElement || this._articleTitleElement,
          a = this.article.element,
          l = r ? r.nextElementSibling : null;
      if (l && (m = l.querySelectorAll(i), 1 === m.length && (l = m[0])), !l || l.matches(i) || hasClassMatchingRegexp(l, n) || l.querySelector(i) || (l = null), l && l.contains(a) && (l = null), l)
          return l;
      var o,
          s,
          c;
      if (r)
          var o = r ? cachedElementBoundingRect(r) : null,
              s = o.left + o.width / 2,
              c = o.top + o.height / 2;
      var m = a.querySelectorAll(i);
      if (m.length)
          return t(m);
      if (a = a.closest("article")) {
          var m = a.querySelectorAll(i);
          if (m.length)
              return t(m)
      }
      return null
  },
  articleDateElementWithBylineElementHint: function(e) {
      function t(e) {
          return /date/.test(e.className) || /\bdatePublished\b/.test(e.getAttribute("itemprop"))
      }
      var n = e.nextElementSibling;
      if (n && t(n))
          return n;
      var i = nextLeafElementForElement(e);
      return i && t(i) ? i : null
  },
  updateArticleBylineAndDateElementsIfNecessary: function() {
      this._didArticleBylineAndDateElementDetection || (this.updateArticleBylineAndDateElements(), this._didArticleBylineAndDateElementDetection = !0)
  },
  updateArticleBylineAndDateElements: function() {
      var e = this.findArticleBylineElement(),
          t = this.findArticleDateElement();
      !t && e && (t = this.articleDateElementWithBylineElementHint(e)), this._articleDateElement = t, this._articleBylineElement = e
  },
  articleIsLTR: function() {
      if (!this._articleIsLTR) {
          var e = getComputedStyle(this.article.element);
          this._articleIsLTR = !e || "ltr" === e.direction
      }
      return this._articleIsLTR
  },
  findSuggestedCandidate: function() {
      var e = this.suggestedRouteToArticle;
      if (!e || !e.length)
          return null;
      var t,
          n;
      for (n = e.length - 1; n >= 0 && (!e[n].id || !(t = this.contentDocument.getElementById(e[n].id))); --n)
          ;
      for (n++, t || (t = this.contentDocument); n < e.length;) {
          for (var i = e[n], r = t.nodeType === Node.DOCUMENT_NODE ? t.documentElement : t.firstElementChild, a = 1; r && a < i.index; r = r.nextElementSibling)
              this.shouldIgnoreInRouteComputation(r) || a++;
          if (!r)
              return null;
          if (r.tagName !== i.tagName)
              return null;
          if (i.className && r.className !== i.className)
              return null;
          t = r, n++
      }
      return isElementVisible(t) ? new CandidateElement(t, this.contentDocument) : null
  },
  findArticleBySearchingAllElements: function(e) {
      var t = this.findSuggestedCandidate(),
          n = this.findCandidateElements();
      if (!n || !n.length)
          return t;
      if (t && t.basicScore() >= ReaderMinimumScore)
          return t;
      for (var i = this.highestScoringCandidateFromCandidates(n), r = i.element; r !== this.contentDocument; r = r.parentNode)
          if ("BLOCKQUOTE" === r.tagName) {
              for (var a = r.parentNode, l = n.length, o = 0; o < l; ++o) {
                  var s = n[o];
                  if (s.element === a) {
                      i = s;
                      break
                  }
              }
              break
          }
      if (t && i.finalScore() < ReaderMinimumScore)
          return t;
      if (!e) {
          if (i.shouldDisqualifyDueToScoreDensity())
              return null;
          if (i.shouldDisqualifyDueToHorizontalRuleDensity())
              return null;
          if (i.shouldDisqualifyDueToHeaderDensity())
              return null;
          if (i.shouldDisqualifyDueToSimilarElements(n))
              return null
      }
      return i
  },
  findExtraArticle: function() {
      if (!this.article)
          return null;
      for (var e = 0, t = this.article.element; e < 3 && t; ++e, t = t.parentNode) {
          var n = this.findExtraArticleCandidateElements(t);
          if (n && n.length)
              for (var i, r = this.sortCandidateElementsInDescendingScoreOrder(n), a = 0; a < r.length && ((i = r[a]) && i.basicScore()); a++)
                  if (!i.shouldDisqualifyDueToScoreDensity() && !i.shouldDisqualifyDueToHorizontalRuleDensity() && !(i.shouldDisqualifyDueToHeaderDensity() || cachedElementBoundingRect(i.element).height < PrependedArticleCandidateMinimumHeight && cachedElementBoundingRect(this.article.element).width !== cachedElementBoundingRect(i.element).width)) {
                      var l = contentTextStyleForNode(this.contentDocument, i.element);
                      if (l && l.fontFamily === this.contentTextStyle().fontFamily && l.fontSize === this.contentTextStyle().fontSize && i)
                          return i
                  }
      }
      return null
  },
  highestScoringCandidateFromCandidates: function(e) {
      for (var t = 0, n = null, i = e.length, r = 0; r < i; ++r) {
          var a = e[r],
              l = a.basicScore();
          l >= t && (t = l, n = a)
      }
      return n
  },
  sortCandidateElementsInDescendingScoreOrder: function(e) {
      function t(e, t) {
          return e.basicScore() !== t.basicScore() ? t.basicScore() - e.basicScore() : t.depth() - e.depth()
      }
      return e.sort(t)
  },
  findCandidateElements: function() {
      const e = 1e3;
      for (var t = Date.now() + e, n = this.contentDocument.getElementsByTagName("*"), i = n.length, r = [], a = 0; a < i; ++a) {
          var l = n[a];
          if (!CandidateTagNamesToIgnore[l.tagName]) {
              var o = CandidateElement.candidateIfElementIsViable(l, this.contentDocument);
              if (o && r.push(o), Date.now() > t) {
                  r = [];
                  break
              }
          }
      }
      for (var s = r.length, a = 0; a < s; ++a)
          r[a].element.candidateElement = r[a];
      for (var a = 0; a < s; ++a) {
          var c = r[a];
          if ("BLOCKQUOTE" === c.element.tagName) {
              var m = c.element.parentElement.candidateElement;
              m && m.addTextNodesFromCandidateElement(c)
          }
      }
      for (var a = 0; a < s; ++a)
          r[a].element.candidateElement = null;
      return r
  },
  findExtraArticleCandidateElements: function(e) {
      if (!this.article)
          return [];
      e || (e = this.article.element);
      for (var t = "preceding-sibling::*/descendant-or-self::*", n = this.contentDocument.evaluate(t, e, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), i = n.snapshotLength, r = [], a = 0; a < i; ++a) {
          var l = n.snapshotItem(a);
          if (!CandidateTagNamesToIgnore[l.tagName]) {
              var o = CandidateElement.extraArticleCandidateIfElementIsViable(l, this.article, this.contentDocument, !0);
              o && r.push(o)
          }
      }
      t = "following-sibling::*/descendant-or-self::*", n = this.contentDocument.evaluate(t, e, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), i = n.snapshotLength;
      for (var a = 0; a < i; ++a) {
          var l = n.snapshotItem(a);
          if (!CandidateTagNamesToIgnore[l.tagName]) {
              var o = CandidateElement.extraArticleCandidateIfElementIsViable(l, this.article, this.contentDocument, !1);
              o && r.push(o)
          }
      }
      return r
  },
  isGeneratedBy: function(e) {
      var t = this.contentDocument.head ? this.contentDocument.head.querySelector("meta[name=generator]") : null;
      if (!t)
          return !1;
      var n = t.content;
      return !!n && e.test(n)
  },
  isMediaWikiPage: function() {
      return this._isMediaWikiPage === undefined && (this._isMediaWikiPage = this.isGeneratedBy(/^MediaWiki /)), this._isMediaWikiPage
  },
  isWordPressSite: function() {
      return this.isGeneratedBy(/^WordPress/)
  },
  nextPageURLString: function() {
      if (!this.article)
          return null;
      if (this.isMediaWikiPage())
          return null;
      var e,
          t = 0,
          n = this.article.element;
      n.parentNode && "inline" === getComputedStyle(n).display && (n = n.parentNode);
      for (var i = n, r = cachedElementBoundingRect(n).bottom + LinkMaxVerticalDistanceFromArticle; isElementNode(i) && cachedElementBoundingRect(i).bottom <= r;)
          i = i.parentNode;
      i === n || i !== this.contentDocument && !isElementNode(i) || (n = i);
      var a = this.contentDocument.evaluate(LinkCandidateXPathQuery, n, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null),
          l = a.snapshotLength;
      if (this.pageNumber <= 2 && !this.prefixWithDateForNextPageURL) {
          var o = this.contentDocument.location.pathname,
              s = o.match(LinkDateRegex);
          s && (s = s[0], this.prefixWithDateForNextPageURL = o.substring(0, o.indexOf(s) + s.length))
      }
      for (var c = 0; c < l; ++c) {
          var m = a.snapshotItem(c),
              d = this.scoreNextPageLinkCandidate(m);
          d > t && (e = m, t = d)
      }
      return e ? e.href : null
  },
  scoreNextPageLinkCandidate: function(e) {
      function t(e, t, n, i) {
          t.substring(0, e.length) === e && (t = t.substring(e.length), e = "");
          var r = t.lastInteger();
          if (isNaN(r))
              return !1;
          var a = e ? e.lastInteger() : NaN;
          return (isNaN(a) || a >= MaximumExactIntegralValue) && (a = i), r === a ? n.lastInteger() === a + 1 : r === a + 1
      }
      function n(e) {
          for (var t = {}, n = e.substring(1).split("&"), i = n.length, r = 0; r < i; ++r) {
              var a = n[r],
                  l = a.indexOf("=");
              -1 === l ? t[a] = null : t[a.substring(0, l)] = a.substring(l + 1)
          }
          return t
      }
      var i = this.contentDocument.location;
      if (e.host !== i.host)
          return 0;
      if (e.pathname === i.pathname && e.search === i.search)
          return 0;
      if (-1 !== e.toString().indexOf("#"))
          return 0;
      if (anchorLinksToAttachment(e) || anchorLinksToTagOrCategoryPage(e))
          return 0;
      if (!isElementVisible(e))
          return 0;
      var r = cachedElementBoundingRect(e),
          a = this.articleBoundingRect(),
          l = Math.max(0, Math.max(a.top - (r.top + r.height), r.top - (a.top + a.height)));
      if (r.top < a.top)
          return 0;
      if (l > LinkMaxVerticalDistanceFromArticle)
          return 0;
      if (Math.max(0, Math.max(a.left - (r.left + r.width), r.left - (a.left + a.width))) > 0)
          return 0;
      var o = i.pathname,
          s = e.pathname;
      if (this.prefixWithDateForNextPageURL) {
          if (-1 === e.pathname.indexOf(this.prefixWithDateForNextPageURL))
              return 0;
          o = o.substring(this.prefixWithDateForNextPageURL.length), s = s.substring(this.prefixWithDateForNextPageURL.length)
      }
      var c = s.substring(1).split("/");
      c[c.length - 1] || c.pop();
      var m = c.length,
          d = o.substring(1).split("/"),
          h = !1;
      d[d.length - 1] || (h = !0, d.pop());
      var u = d.length;
      if (m < u)
          return 0;
      for (var g = 0, f = 0, p = e.textContent, E = 0; E < m; ++E) {
          var v = c[E],
              N = E < u ? d[E] : "";
          if (N !== v) {
              if (E < u - 2)
                  return 0;
              if (v.length >= N.length) {
                  for (var T = 0; v[v.length - 1 - T] === N[N.length - 1 - T];)
                      T++;
                  T && (v = v.substring(0, v.length - T), N = N.substring(0, N.length - T));
                  var A = v.indexOf(N);
                  -1 !== A && (v = v.substring(A))
              }
              t(N, v, p, this.pageNumber) ? f = Math.pow(LinkNextOrdinalValueBase, E - m + 1) : g++
          }
          if (g > 1)
              return 0
      }
      var y = !1;
      if (e.search) {
          linkParameters = n(e.search), referenceParameters = n(i.search);
          for (var S in linkParameters) {
              var b = linkParameters[S],
                  x = S in referenceParameters ? referenceParameters[S] : null;
              if (x !== b)
                  if (null === x && (x = ""), null === b && (b = ""), b.length < x.length)
                      g++;
                  else if (t(x, b, p, this.pageNumber)) {
                      if (LinkURLSearchParameterKeyMatchRegex.test(S)) {
                          if (o.toLowerCase() !== s.toLowerCase())
                              return 0;
                          if (this.isWordPressSite() && h)
                              return 0;
                          y = !0
                      }
                      if (LinkURLBadSearchParameterKeyMatchRegex.test(S)) {
                          g++;
                          continue
                      }
                      f = Math.max(f, 1 / LinkNextOrdinalValueBase)
                  } else
                      g++
          }
      }
      if (!f)
          return 0;
      if ((LinkURLPageSlashNumberMatchRegex.test(e.href) || LinkURLSlashDigitEndMatchRegex.test(e.href)) && (y = !0), !y && m === u && stringSimilarity(o, s) < LinkMinimumURLSimilarityRatio)
          return 0;
      if (LinkURLArchiveSlashDigitEndMatchRegex.test(e))
          return 0;
      var C = LinkMatchWeight * (Math.pow(LinkMismatchValueBase, -g) + f) + LinkVerticalDistanceFromArticleWeight * l / LinkMaxVerticalDistanceFromArticle;
      y && (C += LinkURLSemanticMatchBonus), "LI" === e.parentNode.tagName && (C += LinkListItemBonus);
      var p = e.innerText;
      return LinkNextMatchRegEx.test(p) && (C += LinkNextMatchBonus), LinkPageMatchRegEx.test(p) && (C += LinkPageMatchBonus), LinkContinueMatchRegEx.test(p) && (C += LinkContinueMatchBonus), C
  },
  elementContainsEnoughTextOfSameStyle: function(e, t, n) {
      const i = 110;
      var r = "BODY" === e.tagName,
          a = r ? 2 : 3,
          l = getVisibleNonWhitespaceTextNodes(e, a, i, r, t);
      const o = .2,
          s = clamp(scoreMultiplierForElementTagNameAndAttributes(e), o, Infinity),
          c = n / s / languageScoreMultiplierForTextNodes(l);
      for (var m = {}, d = l.length, h = 0; h < d; ++h) {
          var u = l[h],
              g = u.length,
              f = u.parentElement,
              p = window.getComputedStyle(f),
              E = p.fontFamily + "|" + p.fontSize,
              v = Math.pow(g, TextNodeLengthPower);
          if (m[E]) {
              if ((m[E] += v) > c)
                  break
          } else
              m[E] = v
      }
      for (var E in m)
          if (m[E] > c)
              return !0;
      return !1
  },
  openGraphMetadataClaimsPageTypeIsArticle: function() {
      if (!this._openGraphMetadataClaimsPageTypeIsArticle) {
          var e = this.contentDocument.querySelector("head meta[property='og:type']");
          this._openGraphMetadataClaimsPageTypeIsArticle = e && "article" === e.content
      }
      return this._openGraphMetadataClaimsPageTypeIsArticle
  },
  prismGenreClaimsPageIsHomepage: function() {
      return "homePage" === this.contentFromUniqueMetadataSelector(this.contentDocument, "head meta[name='prism.genre']")
  },
  pointsToUseForHitTesting: function() {
      const e = window.innerWidth,
          t = e / 4,
          n = e / 2,
          i = 128,
          r = 320;
      var a = [[n, 800], [n, 600], [t, 800], [n, 400], [n - i, 1100], [r, 700], [3 * t, 800], [e - r, 700]];
      return this.openGraphMetadataClaimsPageTypeIsArticle() && a.push([n - i, 1400]), a
  },
  findArticleByVisualExamination: function() {
      for (var e = new Set, t = this.pointsToUseForHitTesting(), n = t.length, i = AppleDotComAndSubdomainsRegex.test(this.contentDocument.location.hostname.toLowerCase()) ? 7200 : 1800, r = this.candidateElementFilter, a = 0; a < n; a++)
          for (var l = t[a][0], o = t[a][1], s = elementAtPoint(l, o), c = s; c && !e.has(c); c = c.parentElement) {
              if (VeryPositiveClassNameRegEx.test(c.className))
                  return new CandidateElement(c, this.contentDocument);
              if (!CandidateTagNamesToIgnore[c.tagName]) {
                  var m = c.offsetWidth,
                      d = c.offsetHeight;
                  if (!m && !d) {
                      var h = cachedElementBoundingRect(c);
                      m = h.width, d = h.height
                  }
                  if (!(m < r.minimumWidth || d < r.minimumHeight || m * d < r.minimumArea)) {
                      var u = this.elementContainsEnoughTextOfSameStyle(c, e, i);
                      if (e.add(c), u && !(CandidateElement.candidateElementAdjustedHeight(c) < r.minimumHeight)) {
                          var g = new CandidateElement(c, this.contentDocument);
                          if (!g.shouldDisqualifyDueToSimilarElements()) {
                              if (g.shouldDisqualifyDueToHorizontalRuleDensity())
                                  return null;
                              if (g.shouldDisqualifyDueToHeaderDensity())
                                  return null;
                              if (!g.shouldDisqualifyForDeepLinking())
                                  return g
                          }
                      }
                  }
              }
          }
      return null
  },
  findArticleFromMetadata: function(e) {
      var t = this.contentDocument.querySelectorAll(SchemaDotOrgArticleContainerSelector);
      if (1 === t.length) {
          var n = t[0];
          if (n.matches("article, *[itemprop=articleBody]")) {
              var i = CandidateElement.candidateIfElementIsViable(n, this.contentDocument, !0);
              if (i)
                  return e === FindArticleMode.ExistenceOfElement || i
          }
          var r = n.querySelectorAll("article, *[itemprop=articleBody]"),
              a = elementWithLargestAreaFromElements(r);
          if (a) {
              var i = CandidateElement.candidateIfElementIsViable(a, this.contentDocument, !0);
              if (i)
                  return e === FindArticleMode.ExistenceOfElement || i
          }
          return new CandidateElement(n, this.contentDocument)
      }
      if (this.openGraphMetadataClaimsPageTypeIsArticle() && !this.prismGenreClaimsPageIsHomepage()) {
          var l = this.contentDocument.querySelectorAll("main article"),
              o = elementWithLargestAreaFromElements(l);
          if (o) {
              var i = CandidateElement.candidateIfElementIsViable(o, this.contentDocument, !0);
              if (i)
                  return e === FindArticleMode.ExistenceOfElement || i
          }
          var s = this.contentDocument.querySelectorAll("article");
          if (1 === s.length) {
              var i = CandidateElement.candidateIfElementIsViable(s[0], this.contentDocument, !0);
              if (i)
                  return e === FindArticleMode.ExistenceOfElement || i
          }
      }
      return null
  },
  articleTextContent: function() {
      return this._articleTextContent || this.adoptableArticle(), this._articleTextContent
  },
  unformattedArticleTextContentIncludingMetadata: function(e) {
      var t = this.articleNode();
      if (t) {
          if (!e)
              return t.innerText;
          var n = "",
              i = this.articleTitle();
          i && (n += i + "\n");
          var r = this.articleSubhead();
          r && (n += r + "\n");
          var a = this.adoptableMetadataBlock();
          return a && (n += this.plaintextVersionOfNodeAppendingNewlinesBetweenBlockElements(a) + "\n"), n + t.innerText
      }
  },
  plaintextVersionOfNodeAppendingNewlinesBetweenBlockElements: function(e) {
      var t = this.contentDocument.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null),
          n = "";
      for (t.currentNode = e; t.nextNode();) {
          var i = t.currentNode;
          if (i.nodeType !== Node.TEXT_NODE) {
              var r = i.tagName;
              "P" !== r && "DIV" !== r || (n += "\n")
          } else
              n += i.textContent
      }
      return n
  },
  pageDescription: function() {
      for (var e = this.contentDocument.querySelectorAll("head meta[name]"), t = e.length, n = 0; n < t; ++n) {
          var i = e[n];
          if ("description" === i.getAttribute("name").toLowerCase()) {
              var r = i.getAttribute("content");
              if (r)
                  return r.trim()
          }
      }
      return null
  },
  articleTitleAndSiteNameFromTitleString: function(e) {
      const t = [" - ", " \u2013 ", " \u2014 ", ": ", " | ", " \xbb "],
          n = t.length,
          i = .6;
      for (var r, a, l = this.contentDocument.location.host, o = l.replace(/^(www|m)\./, ""), s = o.replace(/\.(com|info|net|org|edu)$/, "").toLowerCase(), c = 0; c < n; ++c) {
          var m = e.split(t[c]);
          if (2 === m.length) {
              var d = m[0].trim(),
                  h = m[1].trim(),
                  u = d.toLowerCase(),
                  g = h.toLowerCase(),
                  f = Math.max(stringSimilarity(u, o), stringSimilarity(u, s)),
                  p = Math.max(stringSimilarity(g, o), stringSimilarity(g, s)),
                  E = Math.max(f, p);
              (!a || E > a) && (a = E, r = f > p ? {
                  siteName: d,
                  articleTitle: h
              } : {
                  siteName: h,
                  articleTitle: d
              })
          }
      }
      return r && a >= i ? r : null
  },
  pageInformation: function(e, t) {
      var n,
          i = this.pageDescription(),
          r = !1;
      this.adoptableArticle() ? (n = this.articleTitle(), i = i || this.articleTextContent(), r = !0) : (n = this.contentDocument.title, this.contentDocument.body && (i = i || this.contentDocument.body.innerText));
      var a = "",
          l = this.buildMapOfMetaTags(),
          o = this.pageImageURLFromMetadata(l);
      if (o)
          a = o;
      else {
          var s = this.mainImageNode();
          s && (a = s.src)
      }
      n || (n = userVisibleURLString(this.contentDocument.location.href)), n = n.trim(), e && (n = n.substring(0, e));
      var c = this.contentFromUniqueMetadataSelector(this.contentDocument, "head meta[property='og:site_name']");
      if (!c) {
          var m = this.articleTitleAndSiteNameFromTitleString(this.contentDocument.title);
          m && m.articleTitle === n && (c = m.siteName)
      }
      return c || (c = ""), i = i ? i.trim() : "", t && (i = i.substring(0, t)), i = i.replace(/[\s]+/g, " "), {
          title: n,
          previewText: i,
          siteName: c,
          mainImageURL: a,
          isReaderAvailable: r
      }
  },
  readingListItemInformation: function() {
      return this.pageInformation(220, 220)
  },
  buildMapOfMetaTags: function() {
      var e = {};
      const t = this.contentDocument.head.getElementsByTagName("meta"),
          n = t.length;
      for (var i = 0; i < n; ++i) {
          const n = t[i],
              r = n.content;
          if (r && !this.elementAttributesContainImproperQuote(n)) {
              n.name && (e["name:" + n.name.toLowerCase()] = r);
              const t = n.getAttribute("property");
              t && (e["property:" + t.toLowerCase()] = r)
          }
      }
      return e
  },
  longestPageMetadataDescriptionForTextAnalysis: function(e) {
      var t = [];
      const n = e["name:description"];
      n && n.length && t.push(n);
      const i = e["property:og:description"];
      i && i.length && t.push(i);
      const r = e["name:twitter:description"];
      return r && r.length && t.push(r), t.length ? t.reduce(function(e, t) {
          return e.length > t.length ? e : t
      }) : null
  },
  pageTypeForTextAnalysis: function(e) {
      const t = this.contentDocument.documentElement.getAttribute("itemtype");
      if ("http://schema.org/SearchResultsPage" === t || "https://schema.org/SearchResultsPage" === t)
          return PageType.searchResults;
      const n = e["name:section"];
      if (n && "homepage" === n.toLowerCase())
          return PageType.homepage;
      const i = e["property:og:type"];
      if (i) {
          const e = i.toLowerCase();
          if ("homepage" === e)
              return PageType.homepage;
          if ("article" === e)
              return PageType.article
      }
      const r = e["property:analytics-s-channel"];
      return r && "homepage" === r.toLowerCase() ? PageType.homepage : null
  },
  pageTitleForTextAnalysis: function(e) {
      const t = this.contentDocument;
      var n = e["property:og:title"];
      return n || (n = e["name:twitter:title"]), n || (n = e["name:sailthru.headline"]), n || (n = t.title), n
  },
  pageKeywordsForTextAnalysis: function(e) {
      return e["name:keywords"]
  },
  pageAuthorForTextAnalysis: function(e) {
      return e["name:author"] || e["property:author"]
  },
  pageMetadataForTextAnalysis: function() {
      var e = {};
      const t = this.buildMapOfMetaTags(),
          n = this.pageTypeForTextAnalysis(t);
      n && (e.type = n);
      const i = this.longestPageMetadataDescriptionForTextAnalysis(t);
      i && (e.description = i);
      const r = this.pageTitleForTextAnalysis(t);
      r && (e.title = r);
      const a = this.pageKeywordsForTextAnalysis(t);
      a && (e.keywords = a);
      const l = this.pageAuthorForTextAnalysis(t);
      l && (e.author = l);
      const o = this.pageImageURLFromMetadata(t);
      return o && (e.imageURL = o), e
  }
};

var ReaderArticleFinderJS = new ReaderArticleFinder(document);
var article = ReaderArticleFinderJS.articleNode();
// return article;