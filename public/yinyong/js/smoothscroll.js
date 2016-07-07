
    var framerate = 150;
    var animtime = 800;
    var stepsize = 80;
    var pulseAlgorithm = true;
    var pulseScale = 8;
    var pulseNormalize = 1;
    var acceleration = true;
    var accelDelta = 10;
    var accelMax = 1;
    var keyboardsupport = true;
    var disableKeyboard = false;
    var arrowscroll = 50;
    var exclude = "";
    var disabled = false;
    var frame = false;
    var direction = {
        x: 0,
        y: 0
    };
    var initdone = false;
    var fixedback = true;
    var root = document.documentElement;
    var activeElement;
    var key = {
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        spacebar: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36
    };
    function init() {
        if (!document.body) {
            return
        }
        var body = document.body;
        var html = document.documentElement;
        var windowHeight = window.innerHeight;
        var scrollHeight = body.scrollHeight;
        root = (document.compatMode.indexOf("CSS") >= 0) ? html : body;
        activeElement = body;
        initdone = true;
        if (top != self) {
            frame = true
        } else {
            if (scrollHeight > windowHeight && (body.offsetHeight <= windowHeight || html.offsetHeight <= windowHeight)) {
                var pending = false;
                var refresh = function() {
                    if (!pending && html.scrollHeight != document.height) {
                        pending = true;
                        setTimeout(function() {
                            html.style.height = document.height + "px";
                            pending = false
                        }, 500)
                    }
                }
                ;
                html.style.height = "";
                setTimeout(refresh, 10);
                addEvent("DOMNodeInserted", refresh);
                addEvent("DOMNodeRemoved", refresh);
                if (root.offsetHeight <= windowHeight) {
                    var underlay = document.createElement("div");
                    underlay.style.clear = "both";
                    body.appendChild(underlay)
                }
            }
        }
        if (document.URL.indexOf("mail.google.com") > -1) {
            var s = document.createElement("style");
            s.innerHTML = ".iu { visibility: hidden }";
            (document.getElementsByTagName("head")[0] || html).appendChild(s)
        }
        if (!fixedback && !disabled) {
            body.style.backgroundAttachment = "scroll";
            html.style.backgroundAttachment = "scroll"
        }
    }
    var que = [];
    var pending = false;
    var lastScroll = +new Date;
    function scrollArray(elem, left, top, delay) {
        delay || (delay = 1000);
        directionCheck(left, top);
        if (acceleration) {
            var now = +new Date;
            var elapsed = now - lastScroll;
            if (elapsed < accelDelta) {
                var factor = (1 + (30 / elapsed)) / 2;
                if (factor > 1) {
                    factor = Math.min(factor, accelMax);
                    left *= factor;
                    top *= factor
                }
            }
            lastScroll = +new Date
        }
        que.push({
            x: left,
            y: top,
            lastX: (left < 0) ? 0.99 : -0.99,
            lastY: (top < 0) ? 0.99 : -0.99,
            start: +new Date
        });
        if (pending) {
            return
        }
        var scrollWindow = (elem === document.body);
        var step = function() {
            var now = +new Date;
            var scrollX = 0;
            var scrollY = 0;
            for (var i = 0; i < que.length; i++) {
                var item = que[i];
                var elapsed = now - item.start;
                var finished = (elapsed >= animtime);
                var position = (finished) ? 1 : elapsed / animtime;
                if (pulseAlgorithm) {
                    position = pulse(position)
                }
                var x = (item.x * position - item.lastX) >> 0;
                var y = (item.y * position - item.lastY) >> 0;
                scrollX += x;
                scrollY += y;
                item.lastX += x;
                item.lastY += y;
                if (finished) {
                    que.splice(i, 1);
                    i--
                }
            }
            if (scrollWindow) {
                window.scrollBy(scrollX, scrollY)
            } else {
                if (scrollX) {
                    elem.scrollLeft += scrollX
                }
                if (scrollY) {
                    elem.scrollTop += scrollY
                }
            }
            if (!left && !top) {
                que = []
            }
            if (que.length) {
                requestFrame(step, elem, (delay / framerate + 1))
            } else {
                pending = false
            }
        }
        ;
        requestFrame(step, elem, 0);
        pending = true
    }
    function wheel(event) {
        if (!initdone) {
            init()
        }
        var target = event.target;
        var overflowing = overflowingAncestor(target);
        if (!overflowing || event.defaultPrevented || isNodeName(activeElement, "embed") || (isNodeName(target, "embed") && /\.pdf/i.test(target.src))) {
            return true
        }
        var deltaX = event.wheelDeltaX || 0;
        var deltaY = event.wheelDeltaY || 0;
        if (!deltaX && !deltaY) {
            deltaY = event.wheelDelta || 0
        }
        if (Math.abs(deltaX) > 1.2) {
            deltaX *= stepsize / 120
        }
        if (Math.abs(deltaY) > 1.2) {
            deltaY *= stepsize / 120
        }
        scrollArray(overflowing, -deltaX, -deltaY);
        event.preventDefault()
    }
    function keydown(event) {
        var target = event.target;
        var modifier = event.ctrlKey || event.altKey || event.metaKey || (event.shiftKey && event.keyCode !== key.spacebar);
        if (/input|textarea|select|embed/i.test(target.nodeName) || target.isContentEditable || event.defaultPrevented || modifier) {
            return true
        }
        if (isNodeName(target, "button") && event.keyCode === key.spacebar) {
            return true
        }
        var shift, x = 0, y = 0;
        var elem = overflowingAncestor(activeElement);
        var clientHeight = elem.clientHeight;
        if (elem == document.body) {
            clientHeight = window.innerHeight
        }
        switch (event.keyCode) {
        case key.up:
            y = -arrowscroll;
            break;
        case key.down:
            y = arrowscroll;
            break;
        case key.spacebar:
            shift = event.shiftKey ? 1 : -1;
            y = -shift * clientHeight * 0.9;
            break;
        case key.pageup:
            y = -clientHeight * 0.9;
            break;
        case key.pagedown:
            y = clientHeight * 0.9;
            break;
        case key.home:
            y = -elem.scrollTop;
            break;
        case key.end:
            var damt = elem.scrollHeight - elem.scrollTop - clientHeight;
            y = (damt > 0) ? damt + 10 : 0;
            break;
        case key.left:
            x = -arrowscroll;
            break;
        case key.right:
            x = arrowscroll;
            break;
        default:
            return true
        }
        scrollArray(elem, x, y);
        event.preventDefault()
    }
    function mousedown(event) {
        activeElement = event.target
    }
    var cache = {};
    setInterval(function() {
        cache = {}
    }, 10 * 1000);
    var uniqueID = (function() {
        var i = 0;
        return function(el) {
            return el.uniqueID || (el.uniqueID = i++)
        }
    })();
    function setCache(elems, overflowing) {
        for (var i = elems.length; i--; ) {
            cache[uniqueID(elems[i])] = overflowing
        }
        return overflowing
    }
    function overflowingAncestor(el) {
        var elems = [];
        var rootScrollHeight = root.scrollHeight;
        do {
            var cached = cache[uniqueID(el)];
            if (cached) {
                return setCache(elems, cached)
            }
            elems.push(el);
            if (rootScrollHeight === el.scrollHeight) {
                if (!frame || root.clientHeight + 10 < rootScrollHeight) {
                    return setCache(elems, document.body)
                }
            } else {
                if (el.clientHeight + 10 < el.scrollHeight) {
                    overflow = getComputedStyle(el, "").getPropertyValue("overflow-y");
                    if (overflow === "scroll" || overflow === "auto") {
                        return setCache(elems, el)
                    }
                }
            }
        } while (el = el.parentNode)
    }
    function addEvent(type, fn, bubble) {
        window.addEventListener(type, fn, (bubble || false))
    }
    function removeEvent(type, fn, bubble) {
        window.removeEventListener(type, fn, (bubble || false))
    }
    function isNodeName(el, tag) {
        return (el.nodeName || "").toLowerCase() === tag.toLowerCase()
    }
    function directionCheck(x, y) {
        x = (x > 0) ? 1 : -1;
        y = (y > 0) ? 1 : -1;
        if (direction.x !== x || direction.y !== y) {
            direction.x = x;
            direction.y = y;
            que = [];
            lastScroll = 0
        }
    }
    var requestFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback, element, delay) {
            window.setTimeout(callback, delay || (1000 / 60))
        }
    })();
    function pulse_(x) {
        var val, start, expx;
        x = x * pulseScale;
        if (x < 1) {
            val = x - (1 - Math.exp(-x))
        } else {
            start = Math.exp(-1);
            x -= 1;
            expx = 1 - Math.exp(-x);
            val = start + (expx * (1 - start))
        }
        return val * pulseNormalize
    }
    function pulse(x) {
        if (x >= 1) {
            return 1
        }
        if (x <= 0) {
            return 0
        }
        if (pulseNormalize == 1) {
            pulseNormalize /= pulse_(1)
        }
        return pulse_(x)
    }
    addEvent("mousedown", mousedown);
    addEvent("mousewheel", wheel);
    addEvent("load", init);


//@ sourceURL=http://www.shantui.com//resources/modules/smoothscroll.js
