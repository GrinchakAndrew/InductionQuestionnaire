var Accordeon = function(wrapper, numberOfTitles, titlesHeight, tabsNumberByKey) {
    'use strict';
    this.wrapper = wrapper;
    this.numberOfTitles = numberOfTitles;
    this.titlesHeight = titlesHeight || 30;
    this.tabsNumberByKey = tabsNumberByKey;

}

Accordeon.prototype.scroller = function() {
    var config = {
        mousewheelEvt: (/Firefox/i.test(navigator.userAgent)) ? 'DOMMouseScroll' : 'mousewheel',
        myDiv: function() {
            $(document.body).append($('<div>', {
                'id': 'myDiv',
                'position': 'static'
            }));
        },
        columniser: $('.columniser'),
        vertical_position: 0,
        scrollTop: function() {
            return $(document.body).scrollTop();
        },
        scrollUpTo: function() {
            var ff = ~navigator.userAgent.indexOf('Firefox'),
                macOS = ~navigator.userAgent.indexOf('Mac OS') || ~navigator.userAgent.indexOf('Mobile') || ~navigator.userAgent.indexOf('Tablet');
            if (ff) {
                return $(document.body).scrollTop() >= 288;
            } else if (macOS) {
                return parseInt(this.vertical_position) > 0;
            } else {
                return parseInt(this.vertical_position) >= 200;
            }
        },
        scrollDownTo: function() {
            var macOS = ~navigator.userAgent.indexOf('Mac OS') || ~navigator.userAgent.indexOf('Mobile') || ~navigator.userAgent.indexOf('Tablet');
            if (macOS) {
                return this.vertical_position < 0;
            } else {
                return this.vertical_position >= 109;
            }
        },
        append: function() {
            $('#myDiv').append(config.columniser);
        },
        calibrate: function() {
            $('.header').first().css('background-color', '#FFF');
            $('#myDiv').css({
                'position': 'fixed'
            });
        },
        restore: function() {
            $('.left-right-container').before(config.columniser);
            config.columniser.css('margin', '');

            $('.header').first().css({
                'background-color': '#F0F0F0',
                'top': '0px'
            });

            $('#myDiv').css({
                'position': 'static'
            });
        },
        offsetData: {
            x: 0,
            y: 0,
            xOffset: 0,
            yOffset: 0
        },

        offSetStart: function() {
            config.offsetData.x = event.touches[0].pageX;
            config.offsetData.y = event.touches[0].pageY;
        },

        offsetEnd: function() {
            config.offsetData.xOffset = config.offsetData.x - event.touches[0].pageX;
            config.offsetData.yOffset = config.offsetData.y - event.touches[0].pageY;
        },

        scroller: function(e, iOS, android) {
            var _config = {
                initScrollTop: 0,
                event: window.event || e,
                delta: (window.event || e).detail ? (window.event || e).detail * (-120) : (window.event || e).wheelDelta,
                whichView: $('.titles-column-left').css('display') == 'none',
                upwards: function() {
                    return this.delta >= 120 && config.columniser.children().eq(1).children().length;
                },
                iOSupwards: function() {
                    return config.offsetData.yOffset > 0;
                },
                downwards: function() {
                    return this.delta <= -120 && config.columniser.children().eq(1).children().length;
                },
                iOSdownwards: function() {
                    return config.offsetData.yOffset < 0;
                },
                notEmpty: function() {
                    var _target = this.event.srcElement ? this.event.srcElement : this.event.target,
                        returnable = $('.details-body-description').html() ? $(_target).closest('#main').length : $('.details-body-pre code .linenums .L0 span').length > 1;
                    return returnable;
                },
                srollerDo: function() {
                    config.append();
                    config.calibrate();
                }
            };
            subRoutine = function() {
                if (_config.delta && !iOS) {
                    !$('#myDiv').length ? config.myDiv() : '';
                    config.vertical_position = 0;
                    config.vertical_position = (_config.event.offsetY ? _config.event.offsetY : _config.event.clientY) + config.scrollTop();
                    (_config.whichView && _config.upwards() && _config.notEmpty() && (_config.event.offsetY ? _config.event.offsetY : _config.event.clientY)) ? (config.scrollUpTo() ? _config.srollerDo() : config.restore()) : '';
                    (_config.whichView && _config.downwards() && _config.notEmpty() && (_config.event.offsetY ? _config.event.offsetY : _config.event.clientY)) ? (config.scrollDownTo() ? _config.srollerDo() : config.restore()) : '';
                } else if (iOS) { //iOS Tablet Mobile
                    config.vertical_position = config.offsetData.yOffset;
                    (_config.whichView && _config.iOSupwards()) ? (config.scrollUpTo() ? _config.srollerDo() : config.restore()) : '';
                    (_config.whichView && _config.iOSdownwards()) ? (config.scrollDownTo() ? config.restore() : _config.srollerDo()) : '';
                }
            };
            subRoutine();
            return false;
        },
        eventsBinder: function(El, event, handler) {
            if (El && El.addEventListener) {
                El.addEventListener(event, handler);
            } else if (El && El.attachEvent) {
                El.attachEvent('on' + event, handler);
            }
        }
    };
    $(document).ready(function() {
        /*Click-opening the .title-1 and .title-2 on page load:*/
        $('.title').first().click();
        $('.title:contains("Questions")').click();

        config.eventsBinder(document, config.mousewheelEvt, function(e) {
            config.scroller(e);
        });
        /*somehow the 'mousedown' works for android*/
        config.eventsBinder(document, 'mousedown', function(e) {
            config.scroller(e);
        });
        if ('ontouchstart' in document.createElement('div')) {
            config.eventsBinder(window, 'touchstart', function(e) {
                config.offSetStart();
            });
            /*android does not fire the 'touchmove' event*/
            config.eventsBinder(window, 'touchmove', function(e) {
                config.offsetEnd();
                if (config.offsetData.yOffset) {
                    config.scroller(e, true);
                }
            });
        }
    });
};
Accordeon.prototype.build = function(taskNames) {
    'use strict';
    var that = this,
        elements = {
            columniser: $('<div>', {
                class: 'columniser'
            }),
            columniserText: $('<div>', {
                class: 'columniser-text'
            }),
            scrollingLeftWrapper: $('<div>', {
                class: 'scrollingLeftWrapper'
            }).css({
                'display': 'inline',
                'position': 'relative',
                'padding': '0px 14px'
            }),
            titlesColumnLeft: !$('.titles-column-left').length ? $('<div>', {
                class: 'titles-column-left'
            }) : $('.titles-column-left'),
            title: !$('.title').length ? $('<div>', {
                class: 'title'
            }) : $('.title'),
            detailsBody: !$('.details-body').length ? $('<div>', {
                class: 'details-body'
            }) : $('.details-body'),
            detailsBodyEntrails: !$('.details-body-entrails').length ? $('<div>', {
                class: 'details-body-entrails'
            }) : $('.details-body-entrails'),
            detailsBodyDescription: !$('.details-body-description').length ? $('<div>', {
                class: 'details-body-description'
            }) : $('.details-body-description'),
            detailsBodyPre: !$('.details-body-pre').length ? $('<pre>', {
                class: 'details-body-pre'
            }) : $('.details-body-pre'),
            detailsBodyCode: !$('.details-body-code').length ? $('<code>', {
                class: 'details-body-code prettyprint lang-js linenums'
            }) : $('.details-body-code'),
            leftRightContainer: $('<div>', {
                class: 'left-right-container'
            }),
            span: $('<span>'),
            subParent: $('<div>', {
                class: 'subParent'
            }).css('overflow', 'hidden'),
            subParentArrowRight: $('<div>', {
                class: 'subparentarrowright'
            }).css({
                'pointer-events': 'none'
            }),
            collapsible: !$('.collapsible').length ? $('<div>', {
                class: 'collapsible'
            }).text('[Expand All]') : $('.collapsible'),
            scrollingForAnimatedColumnView: function() {},
            animate: function(el, speed, parent, subParentArrow2Change, scrollingForAnimatedColumnView) {
                $(el).css('pointer-events', 'none');
                $(parent).css('pointer-events', 'none');
                var interval,
                    _toggleSubParentArrowChange = function(subParentArrow2Change) {
                        if (subParentArrow2Change) {
                            if (subParentArrow2Change.className === 'subparentarrowright') {
                                subParentArrow2Change.className = 'subparentarrowdownward'
                            } else if (subParentArrow2Change.className === 'subparentarrowdownward') {
                                subParentArrow2Change.className = 'subparentarrowright';
                            }
                        }
                    };
                if (parseInt(el.style.opacity) < 1 || parseInt(el.style.opacity) === 0) {
                    el.style.display = '';
                    interval = setInterval(function() {
                        if (parseFloat(el.style.opacity) < 1) {
                            el.style.opacity = parseFloat(el.style.opacity) + 0.1;
                        } else {
                            clearInterval(interval);
                            $(el).css('pointer-events', '');
                            _toggleSubParentArrowChange(subParentArrow2Change);
                            $(parent).css('pointer-events', '');
                            $(parent).css('overflow', '');
                            if (typeof scrollingForAnimatedColumnView === 'function') {
                                scrollingForAnimatedColumnView();
                            }
                        }
                    }, speed);
                } else if (parseInt(el.style.opacity) === 1 || parseInt(el.style.opacity) > 1) {
                    interval = setInterval(function() {
                        if ((parseFloat(parseFloat(el.style.opacity).toFixed(2))) > 0) {
                            el.style.opacity = parseFloat(parseFloat(el.style.opacity).toFixed(2)) - 1 / 10;
                        } else {
                            clearInterval(interval);
                            $(el).css('pointer-events', '');
                            el.style.display = 'none';
                            _toggleSubParentArrowChange(subParentArrow2Change);
                            $(parent).css('overflow', 'hidden');
                            $(parent).css('pointer-events', '');
                            if (typeof scrollingForAnimatedColumnView === 'function') {
                                scrollingForAnimatedColumnView();
                            }
                        }
                    }, speed);
                }
            },
            subParentBuild: function(i) {
                var _this = this,
                    subParents = {},
                    subParentsIndexed = {},
                    children = {},
                    _subParent,
                    subParentsArrayed = [],
                    _subParentFinalize = function(El) {
                        El.css('height', parseInt(El.children().first().css('padding-top') ? El.children().first().css('padding-top').match(/\d+/)[0] : 0) +
                            parseInt(El.children().first().css('padding-bottom') ? El.children().first().css('padding-bottom').match(/\d+/)[0] : 0) +
                            Math.ceil(parseFloat(El.children().first().css('height').match(/\d+[\\.]?\d+/) ? El.children().first().css('height').match(/\d+[\\.]?\d+/)[0] : 0)) + 'px');
                        El.on('click', function(e) {
                            if (e.target.className === 'series' || e.target.className === 'title') {
                                var _subRoutine = function(_El, parent, subParentArrow2Change, scrollingForAnimatedColumnView) {
                                        if (_El.className === 'subParent') {
                                            _El.style.display = 'inline';
                                            if (!_El.firstChild.style.opacity || parseInt(_El.firstChild.style.opacity) < 1) {
                                                _El.firstChild.style.opacity = 0;
                                            } else {
                                                _El.firstChild.style.opacity = 1;
                                            }
                                            _this.animate(_El.firstChild, 60, parent, subParentArrow2Change);
                                        } else {
                                            if (!_El.style.opacity || parseInt(_children[i].style.opacity) < 1) {
                                                _El.style.opacity = 0;
                                            } else {
                                                _El.style.opacity = 1;
                                            }
                                            _El.style.display = '';
                                            _this.animate(_El, 60, parent, subParentArrow2Change);
                                        }
                                        if (scrollingForAnimatedColumnView && typeof scrollingForAnimatedColumnView === 'function') {
                                            scrollingForAnimatedColumnView();
                                        }
                                    },
                                    _children = [],
                                    firstSubParent,
                                    parent = this,
                                    subParentArrow2Change;
                                if ((e.target.className === 'series' &&
                                        e.target['innerText' in e.target ? 'innerText' : 'innerHTML'] ===
                                        this.firstElementChild.getElementsByTagName('span')[0]
                                        ['innerText' in this.firstElementChild.getElementsByTagName('span')[0] ? 'innerText' : 'innerHTML']
                                    ) || (e.target.className === 'title' &&
                                        e.target.getElementsByTagName('span')[0]['innerText' in e.target.getElementsByTagName('span')[0] ? 'innerText' : 'innerHTML'] ===
                                        this.firstElementChild.getElementsByTagName('span')[0]['innerText' in this.firstElementChild.getElementsByTagName('span')[0] ? 'innerText' : 'innerHTML']
                                    )) {
                                    if (this.firstChild.querySelector('div').className === 'subparentarrowright') {
                                        subParentArrow2Change = this.firstChild.querySelector('div');
                                        _children = _children.concat(Array.prototype.slice.call(this.children));
                                        _children.splice(0, 1);
                                    } else if (this.firstChild.querySelector('div').className === 'subparentarrowdownward') {
                                        subParentArrow2Change = this.firstChild.querySelector('div');
                                        var _router = function(arr) {
                                            for (var i = arr.length; i--;) {
                                                if (arr[i].className === 'subParent' && arr[i].querySelector('.subparentarrowdownward')) {
                                                    arr[i].querySelector('.subparentarrowdownward').className = 'subparentarrowright';
                                                    _router(arr[i].children);
                                                } else {
                                                    _children.splice(_children.length, 0, arr[i]);
                                                }
                                            }
                                        };
                                        _children = _children.concat(Array.prototype.slice.call(this.children));
                                        _children.splice(0, 1);
                                        _router(_children);
                                    }
                                    for (var i = 0; i < _children.length; i += 1) {
                                        _subRoutine(_children[i], parent);
                                        if (i === _children.length - 1) {
                                            _subRoutine(_children[i], parent, subParentArrow2Change, _this.scrollingForAnimatedColumnView);
                                        }
                                    }
                                    _children = [];
                                }
                            }
                        });
                    },
                    divideSubParents = function(arr, counter, prevParent, mainParentToBeMadeBold) {
                        if (!counter) {
                            var counter = 0;
                        }
                        for (var i = 0; i < arr.length; i++) {
                            if (typeof arr[i] === 'string' && ({}).toString.call(arr[i + 1]) === '[object Array]') {
                                counter++;
                                var subParent = arr[i];
                                subParentsIndexed[subParent] = counter;
                                subParents[subParent] = $('<div>', {
                                    class: 'subParent'
                                }).css('overflow', 'hidden').css('display', 'inline');
                                if (mainParentToBeMadeBold && that.tabsNumberByKey[mainParentToBeMadeBold[0]] === 0) {
                                    subParents[subParent].append(_this.title.clone().css('padding-bottom', 8 + 'px').css('padding-left', 8 + 'px').css('padding-top', 8 + 'px').append(_this.subParentArrowRight.clone()).append(_this.span.clone().text(mainParentToBeMadeBold[0]).addClass('series').css({
                                        'font-weight': 'bold'
                                    })));
                                } else {
                                    subParents[subParent].append(_this.title.clone().css('padding-bottom', 8 + 'px').css('padding-left', 8 + 'px').css('padding-top', 8 + 'px').append(_this.subParentArrowRight.clone().css('margin-left', '15px')).append(_this.span.clone().text(subParent).addClass('series')));
                                }
                            } else if (({}).toString.call(arr[i]) === '[object Array]') {
                                if (subParent) {
                                    if (!children[subParent]) {
                                        children[subParent] = [];
                                    }
                                    if (arr[i].length === 1 || typeof arr[i][1] === 'string') {
                                        children[subParent].push(_this.title.clone().css('display', 'none').css('padding-bottom', 8 + 'px').css('padding-top', 4 + 'px').css('padding-left', 8 + 'px').append(_this.span.clone().css('margin-left', '30px').text(arr[i][0])));
                                    }
                                }
                                divideSubParents(arr[i], counter, subParent);
                            } else if (typeof arr[i] === 'string' && prevParent) {
                                if (!(arr[i] in subParents)) {
                                    if ((function(El) {
                                            for (var i = children[prevParent].length; i--;) {
                                                if (children[prevParent][i].text() === El) {
                                                    return false;
                                                } else {
                                                    continue;
                                                }
                                            }
                                            return true;
                                        })(arr[i])) {
                                        children[prevParent].push(_this.title.clone().css('display', 'none').css('padding-bottom', 8 + 'px').css('padding-top', 4 + 'px').css('padding-left', 8 + 'px').append(_this.span.clone().css('margin-left', '30px').text(arr[i])));
                                    }
                                }
                            }
                        }
                    },
                    _subRoutine = function() {
                        if (children) {
                            for (var key in children) {
                                if (key in subParents) {
                                    if (({}).toString.call(children[key]) === '[object Array]') {
                                        for (var i = 0; i < children[key].length; i += 1) {
                                            subParents[key].append(children[key][i]);
                                        }
                                    }
                                }
                            }
                        }
                        children = null;
                        for (var key in subParentsIndexed) {
                            subParentsArrayed.splice(subParentsIndexed[key], 0, key);
                        }
                        for (var i = subParentsArrayed.length; i--;) {
                            if (subParentsArrayed[i] in subParents) {
                                if (subParents[subParentsArrayed[i - 1]]) {
                                    subParents[subParentsArrayed[i]].css('display', 'none');
                                    subParents[subParentsArrayed[i - 1]].append(subParents[subParentsArrayed[i]]);
                                    _subParentFinalize(subParents[subParentsArrayed[i]]);
                                    delete subParents[subParentsArrayed[i]];
                                }
                            }
                        }
                        _subParentFinalize(subParents[Object.keys(subParents)[0]]);
                        _this.titlesColumnLeft.append(subParents[Object.keys(subParents)[0]]);
                    };
                if (({}).toString.call(taskNames[i]) === '[object Array]') {
                    divideSubParents(taskNames[i], null, null, taskNames[i]);
                    _subRoutine();
                }
            },
            uncollapseAll: function(_t) {
                if (!$('.collapsible').length) {
                    $('.title span:contains("GTS Induction")').after(_t.collapsible);
                    $('.collapsible').on('click', function(e) {
                        $(this).css('display', 'none');
                        $(this).on('makeCollapsibleVisibleAgain', function() {
                            $(this).css('display', '');
                        });
                        if ($('.collapsible').text() === '[Expand All]') {
                            $('.subParent').each(function() {
                                $(this).css({
                                    'display': 'inline',
                                    'overflow': '',
                                    'opacity': ''
                                });
                            });
                            $('.subParent .title').not(':first').each(function() {
                                $(this).css({
                                    'display': '',
                                    'opacity': 1,
                                })
                            });
                            $('.subParent .subparentarrowright').each(function() {
                                $(this).removeClass().addClass('subparentarrowdownward');
                            });
                            $('.collapsible').text('[Uncollapse All]').trigger('makeCollapsibleVisibleAgain');
                            _t.scrollingForAnimatedColumnView();
                        } else if ($('.collapsible').text() === '[Uncollapse All]') {
                            $('.subParent .subparentarrowdownward').closest('.subParent .title').each(function() {
                                $(this).trigger('click')
                            });
                            $(this).css('display', 'none');
                            $('.collapsible').text('[Expand All]').trigger('makeCollapsibleVisibleAgain');
                            $('.subParent .title').not(':first').not(':contains("Questions")').each(function() {
                                $(this).css({
                                    'display': 'none'
                                });
                            });
                        }
                    });
                }
            },
            fn: function() {
                that.wrapper.append(this.columniser);
                $('.columniser').append(this.columniserText.text('Induction Entries'));
                $('.columniser').append(this.scrollingLeftWrapper);
                this.scrollingLeftWrapper.after(this.columniserText.clone().text(''));
                that.wrapper.append(this.leftRightContainer);
                $('.left-right-container').append(this.titlesColumnLeft);
                $('.left-right-container').append(this.detailsBody);
                this.detailsBody.append(this.detailsBodyEntrails);
                this.detailsBodyEntrails.append(this.detailsBodyPre);
                this.detailsBodyPre.append(this.detailsBodyCode);
                this.detailsBody.append(this.detailsBodyDescription);

                if (that.numberOfTitles) {
                    var __length = taskNames.length;
                    for (var i = 0; i < __length; i += 1) {
                        if (({}).toString.call(taskNames[i]) === '[object String]') {
                            this.titlesColumnLeft.append(this.title.clone().css('padding-bottom', 8 + 'px').css('padding-top', 4 + 'px').css('padding-left', 8 + 'px').append(this.span.clone().text(taskNames[i])));
                        } else if (({}).toString.call(taskNames[i]) === '[object Array]') {
                            this.subParentBuild(i);
                        }
                    }
                }
                this.uncollapseAll(this);
            }
        };
    elements.fn();
}
Accordeon.prototype.tabulator = function(tabsNum, tabsNames, jsonObject, clickedTitleText) {
    'use strict';
    var that = this,
        elements = {
            wrapper: $('<div>', {
                class: 'tabulator-wrapper'
            }),
            ul: $('<ul>', {
                class: 'tabulator-ul'
            }),
            li: $('<li>', {
                class: 'tabs-li'
            }),
            span: $('<span>'),
            div: $('<div>', {
                class: 'tabulator-div hover-me'
            }),
            scrollingLeft: !$('.scrolling-left').length ? $('<div>', {
                class: 'scrolling-left'
            }) : $('.scrolling-left'),
            scrollingRight: !$('.scrolling-right').length ? $('<div>', {
                class: 'scrolling-right'
            }) : $('.scrolling-left'),
            arrowLeft: $('<div>', {
                class: 'arrow-left'
            }),
            arrowRight: $('<div>', {
                class: 'arrow-right'
            }),
            tabsOverallWidth: 0,
            _i: tabsNum,
            arrOverflowingTabs: [],
            arrOverflowingTabsWidth: 0,
            TabsBeforeOverflowingTab: [],
            overFlowIndex: [],
            clicksCount: 0,
            _width: 0,
            overFlow: function(arr) {
                if (!this.TabsBeforeOverflowingTab.length) {
                    var allTabs = $('.tabulator-div'),
                        prevTabBeforeOverflowingTab;
                    for (var i = allTabs.length; arr.length && i--;) {
                        if (i && ~allTabs[i]['innerText' in $('.tabulator-div')[0] ? 'innerText' : 'innerHTML'].indexOf(arr[0]['innerText' in arr[0] ? 'innerText' : 'innerHTML'])) {
                            prevTabBeforeOverflowingTab = i > 0 ? allTabs[i - 1] : allTabs[i];
                        }
                        if (i && prevTabBeforeOverflowingTab) {
                            this.TabsBeforeOverflowingTab.push(allTabs[i - 1]);
                        }
                    }
                }
            },
            buildTabs: function() {
                if (!$('.columniser-text').eq(1).length) {
                    $('.columniser').append($('<div>', {
                        'class': 'columniser-text'
                    }));
                    $('.columniser-text').eq(1).append(this.wrapper);
                } else {
                    $('.columniser-text').eq(1).append(this.wrapper);
                }
                this.wrapper.append(this.ul);
                while (this._i--) {
                    this.ul.append(this.li.clone().append(this.div.clone().append(this.span.clone().text(tabsNames[this._i]))));
                    this.tabsOverallWidth += ($('.tabulator-div').last().outerWidth());
                    if (this.tabsOverallWidth > $('.tabulator-wrapper').outerWidth()) {
                        this.arrOverflowingTabs.push($('.tabulator-div').last()[0]);
                        this.arrOverflowingTabsWidth += $('.tabulator-div').last().outerWidth();
                    }
                }
                $(this.arrOverflowingTabs).each(function() {
                    $(this).css('display', 'none');
                })
            },
            scrollingArrows: function() {
                if (!$('.scrolling-right').length) {
                    $('.columniser .columniser-text').eq(1).after(this.scrollingRight.append(this.arrowRight));
                }
                if (!$('.scrolling-left').length) {
                    $('.scrollingLeftWrapper').append(this.scrollingLeft.append((this.arrowLeft)));
                }
            },
            overFlowIndexCalculate: function() {
                if (!this.overFlowIndex.length) {
                    for (var i = 0; i < this.arrOverflowingTabs.length; i++) {
                        this._width += this.arrOverflowingTabs[i].parentNode.offsetWidth;
                        if (this._width +
                            (this.arrOverflowingTabs[i + 1] ?
                                this.arrOverflowingTabs[i + 1].parentNode.offsetWidth :
                                this.arrOverflowingTabs[i].parentNode.offsetWidth) >
                            $('.tabulator-wrapper').outerWidth()) {
                            this.overFlowIndex.push(i);
                            this._width = 0;
                        } else if (this._width < $('.tabulator-wrapper').outerWidth() && i === this.arrOverflowingTabs.length - 1) {
                            this.overFlowIndex.push(i + 1);
                            this._width = 0;
                        }
                        if (i === this.arrOverflowingTabs.length - 1 && this.overFlowIndex[this.overFlowIndex.length - 1] !== i + 1) {
                            this.overFlowIndex.push(i + 1);
                        }
                    }
                }
            },
            posting: function(path) {
                'use strict';
                if (Object.prototype.toString.call(path) === '[object String]') {
                    var _request = new XMLHttpRequest();
                    if (!~navigator.userAgent.indexOf('IE')) {
                        _request.overrideMimeType('application/json');
                    }
                    _request.open('get', path, true);
                    _request.onreadystatechange = function() {
                        if (_request.readyState === 4) {
                            var _text = _request.responseText;
                            if (_text) {
                                if (path.match(/code/i) || path.match(/description/i) || path.match(/induction/i)) {
                                    $('body').trigger('posting', [
                                        _text, (path.match(/code/i) ? path.match(/code/i)[0] : null) || (path.match(/induction/i) ? path.match(/induction/i)[0] : null) || (path.match(/description/i) ? path.match(/description/i)[0] : null)
                                    ]);
                                } else {
                                    $('body').trigger('posting', _text);
                                }
                            }
                        }
                    };
                    _request.send();
                }
            },
            runOnce: false,
            rightClickFn: function(_this) {
                switch (_this.clicksCount) {
                    case 0:
                        {
                            $(_this.arrOverflowingTabs).each(function(i, j) {
                                $(this).parent().css('display', '');
                                $(this).css('display', '');
                            });
                            _this.TabsBeforeOverflowingTab[_this.clicksCount] ?
                                _this.TabsBeforeOverflowingTab[_this.clicksCount].parentNode.style.display = 'none' : '';
                            for (var i = 1; i < _this.arrOverflowingTabs.length; i++) {
                                _this.arrOverflowingTabs[i].parentNode.style.display = 'none';
                            }
                            if (_this.arrOverflowingTabs[_this.clicksCount].children[0].tagName == 'SPAN') {
                                _this.arrOverflowingTabs[_this.clicksCount].children[0].style.whiteSpace = 'nowrap';
                                $('.tabulator-wrapper').width(_this.arrOverflowingTabs[_this.clicksCount].children[0].offsetWidth + 5);
                            }
                            if (!_this.arrOverflowingTabs[_this.clicksCount + 1]) {
                                $('.scrolling-right').css('display', 'none');
                                $('.scrolling-left').css('display', '');
                                $('.scrolling-left .arrow-left').css('display', '');
                            }
                            break;
                        }
                    case 1:
                        {
                            _this.arrOverflowingTabs[_this.clicksCount - 1].parentNode.style.display = 'none';
                            _this.arrOverflowingTabs[_this.clicksCount - 1].style.display = 'none';
                            $(_this.arrOverflowingTabs).each(function(i, j) {
                                if (j !== _this.arrOverflowingTabs[_this.clicksCount - 1]) {
                                    $(this).parent().css('display', '');
                                    $(this).css('display', '');
                                }
                            });
                            _this.overFlowIndexCalculate();
                            for (var i = _this.overFlowIndex[_this.clicksCount] + 1; i < _this.arrOverflowingTabs.length; i++) {
                                _this.arrOverflowingTabs[i].parentNode.style.display = 'none';
                            }
                            $('.tabs-li:not([style*=display])').css('white-space', 'nowrap');
                            $('.tabulator-wrapper').outerWidth($('.tabs-li:not([style*=display]) div span').outerWidth() + 10);

                            break;
                        }
                    default:
                        {
                            if (!!_this.overFlowIndex[_this.clicksCount - 1] && _this.arrOverflowingTabs[_this.overFlowIndex[_this.clicksCount]]) {
                                $(_this.arrOverflowingTabs).each(function(i, j) {
                                    $(this).parent().css('display', 'none');
                                    $(this).css('display', 'none');
                                });
                                _this.arrOverflowingTabs[_this.overFlowIndex[_this.clicksCount]].parentNode.style.display = '';
                                _this.arrOverflowingTabs[_this.overFlowIndex[_this.clicksCount]].style.display = '';

                                $('.tabs-li:not([style*=display])').css('white-space', 'nowrap');
                                $('.tabulator-wrapper').outerWidth($('.tabs-li:not([style*=display]) div span').outerWidth() + 10);
                            } else {
                                $('.scrolling-right').css('display', 'none');
                                $('.scrolling-left').css('display', '');
                            }
                            if (_this.arrOverflowingTabs[_this.arrOverflowingTabs.length - 1] === _this.arrOverflowingTabs[_this.overFlowIndex[_this.clicksCount]] ||
                                _this.arrOverflowingTabs[_this.overFlowIndex[_this.clicksCount]] == undefined) {
                                $('.scrolling-right').css('display', 'none');
                                $('.scrolling-left').css('display', '');
                                $('.scrolling-left .arrow-left').css('display', '');
                            }
                            break;
                        }
                }
                _this.clicksCount += 1;
            },
            leftClickFn: function(_this) {
                $(_this.arrOverflowingTabs).each(function() {
                    $(this).parent().css('display', 'none');
                });

                $(_this.arrOverflowingTabs).each(function() {
                    $(this).css('display', '');
                });

                $(_this.TabsBeforeOverflowingTab).each(function() {
                    $(this).parent().css('display', '');
                });

                $('.scrolling-right').css('display', '');
                $('.scrolling-left').css('display', 'none');

                _this.clicksCount = 0;

                $('.scrolling-left div').first().css({
                    'border-top': '10px solid rgba(0, 0, 0, 0)',
                    'border-bottom': '10px solid rgba(0, 0, 0, 0)',
                    'border-right': '10px solid #C51F00'
                });

                $('.scrolling-right div').first().css({
                    'border-top': '10px solid rgba(0, 0, 0, 0)',
                    'border-bottom': '10px solid rgba(0, 0, 0, 0)',
                    'border-left': '10px solid #C51F00'
                });
                (function() {
                    return (function() {
                        var _width = Number();
                        _this.TabsBeforeOverflowingTab[0].querySelector('span').style.whiteSpace = 'nowrap';
                        _width = _this.TabsBeforeOverflowingTab[0].querySelector('span').offsetWidth;
                        $('.tabulator-ul').css('white-space', "nowrap");
                        $('.tabulator-wrapper').width(_width + 7);
                    })();
                })();
                return _this.TabsBeforeOverflowingTab;
            },

            tabsClickAndPostingCall: function(_this, THIS) {
                var clickedTabTitle,
                    ClickedTabTitlePathText = '',
                    _subRoutine = function(arr, clickedTabTitle) {
                        for (var i = arr.length; !ClickedTabTitlePathText && i--;) {
                            if (({}).toString.call(arr[i]) === '[object Object]') {
                                for (var q in arr[i]) {
                                    if (({}).toString.call(arr[i][q]) === '[object Array]') {
                                        _subRoutine(arr[i][q], clickedTabTitle);
                                    } else if (({}).toString.call(arr[i][q]) === '[object Object]') {
                                        if (clickedTitleText in arr[i]) {
                                            if (({}).toString.call(arr[i][clickedTitleText]) === '[object Object]') {
                                                if (clickedTabTitle in arr[i][clickedTitleText]) {
                                                    ClickedTabTitlePathText = arr[i][clickedTitleText][clickedTabTitle];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };
                if ('innerText' in THIS) {
                    clickedTabTitle = THIS['innerText'].replace(/\s+$/, '');
                } else if ('innerHTML' in THIS) {
                    clickedTabTitle = clickedTabTitle = THIS['innerHTML'].match(/<span.*>.*<\/span>/)[0].match(/<span.*>(.*)<\/span>/)[1];
                }
                for (var i in jsonObject) {
                    if (({}).toString.call(jsonObject[i]) === '[object Object]' && i === clickedTitleText && jsonObject[i][clickedTabTitle]) {
                        ClickedTabTitlePathText = jsonObject[i][clickedTabTitle];
                        break;
                    } else if (({}).toString.call(jsonObject[i]) === '[object Array]' && !ClickedTabTitlePathText) {
                        _subRoutine(jsonObject[i], clickedTabTitle);
                        if (ClickedTabTitlePathText) {
                            break;
                        }
                    }
                }
                _this.posting(ClickedTabTitlePathText);
            },
            arrowsHover4iOSnMS: function() {

                if ('ontouchstart' in document.createElement('div')) {

                    $('.scrolling-left').on('touchstart', function() {
                        var el = $(this.firstChild);
                        el.css('border-top', '25px solid rgba(0, 0, 0, 0)');
                        el.css('border-bottom', '25px solid rgba(0, 0, 0, 0)');
                        el.css('border-right', '25px solid #C51F00');
                        el.css('margin-left', '0px');
                    });

                    $('.scrolling-left').on('touchend', function() {
                        var el = $(this.firstChild);
                        el.css('border-top', '10px solid rgba(0, 0, 0, 0)');
                        el.css('border-bottom', '10px  solid rgba(0, 0, 0, 0)');
                        el.css('border-right', '10px  solid #C51F00');
                        $(this).css('position', 'absolute');
                    });

                    $('.scrolling-right').on('touchstart', function() {
                        var el = $(this.firstChild);
                        el.css('border-top', '25px solid rgba(0, 0, 0, 0)');
                        el.css('border-bottom', '25px solid rgba(0, 0, 0, 0)');
                        el.css('border-left', '25px solid #C51F00');
                    });
                    $('.tabulator-div.hover-me').removeClass('hover-me');
                } else {
                    $('.scrolling-left').on('mouseover', function() {
                        var el = $(this.firstChild);
                        el.css('border-top', '25px solid rgba(0, 0, 0, 0)');
                        el.css('border-bottom', '25px solid rgba(0, 0, 0, 0)');
                        el.css('border-right', '25px solid #C51F00');
                        el.css('margin-left', '-14px');
                    });
                    $('.scrolling-left').on('mouseleave', function() {
                        var el = $(this.firstChild);
                        el.css('border-top', '10px solid rgba(0, 0, 0, 0)');
                        el.css('border-bottom', '10px solid rgba(0, 0, 0, 0)');
                        el.css('border-right', '10px solid #C51F00');
                        $('.scrollingLeftWrapper').css('padding', "0px 14px");
                        el.css('margin-left', '0');
                    });
                    $('.scrolling-right').on('mouseover', function() {
                        var el = $(this.firstChild);
                        el.css('border-top', '25px solid rgba(0, 0, 0, 0)');
                        el.css('border-bottom', '25px solid rgba(0, 0, 0, 0)');
                        el.css('border-left', '25px solid #C51F00');
                    });
                    $('.scrolling-right').on('mouseleave', function() {
                        var el = $(this.firstChild);
                        el.css('border-top', '10px solid rgba(0, 0, 0, 0)');
                        el.css('border-bottom', '10px solid rgba(0, 0, 0, 0)');
                        el.css('border-left', '10px solid #C51F00');
                    });
                }
            },
            fn: function(rightClickFn, leftClickFn, tabsClickAndPostingCall) {
                $('body').off('title-change');
                $('body').on('title-change', function() {
                    if ($('#clickableTitleArrow').length) {
                        $('#clickableTitleArrow').parent().css('color', '#C51F00');
                        $('#clickableTitleArrow').parent().css('background-color', '')
                        $('#clickableTitleArrow').remove();
                    }
                    _this.clicksCount = 0;
                    this.overFlowIndex = [];
                    this.TabsBeforeOverflowingTab = [];
                    $('.scrolling-left div').first().css({
                        left: $('div[class|=columniser-text]:nth-child(1)').width() + parseFloat($('table[class*=c24]').css('margin-left').match(/\d*.?\d*/)) + 'px',
                        'border-top': '10px solid rgba(0, 0, 0, 0)',
                        'border-bottom': '10px solid rgba(0, 0, 0, 0)',
                        'border-left': '10px solid #C51F00',
                        'border-style': ''
                    });
                });
                var _this = this,
                    eventName;
                if ('ontouchstart' in document) {
                    eventName = 'touchstart';
                } else {
                    eventName = 'click';
                }
                _this.buildTabs();
                if (this.tabsOverallWidth > $('.tabulator-wrapper').outerWidth()) {
                    _this.scrollingArrows();
                    _this.overFlow(_this.arrOverflowingTabs);
                    var tabsLiCol = document.querySelectorAll('.tabs-li'),
                        tabsLiColwidth = 0,
                        index = 0,
                        _w = 0;

                    $('.arrow-left').on(eventName, function(e) {
                        var tabsBeforeOverflowingTabs = leftClickFn(_this),
                            _w = 0;
                        tabsBeforeOverflowingTabs.forEach(function(i, j) {
                            _w += i.offsetWidth;
                        });
                    });

                    $('.arrow-right').on(eventName, function() {
                        rightClickFn(_this);
                        var tabsLiCol = document.querySelectorAll('.tabs-li'),
                            tabsLiColwidth = 0;
                        Array.prototype.forEach.call(tabsLiCol, function(i, j) {
                            if (i.style.display !== 'none') {
                                tabsLiColwidth += i.offsetWidth;
                            }
                            if (tabsLiColwidth) {
                                $('.tabulator-wrapper').outerWidth(tabsLiColwidth);
                            }
                        });
                    });
                    _this.arrowsHover4iOSnMS();
                }
                $('.tabs-li').on(eventName, function() {
                    tabsClickAndPostingCall(_this, this);
                    if ($('.tabs-li').length > 1) {
                        if ($('.tabs-li').first().children().first().css('background-color') === 'rgb(197, 31, 0)' &&
                            $('.tabs-li').first().children().first().children().first().css('color') === 'rgb(255, 255, 255)') {
                            $('.tabs-li').first().children().first().css('background-color', '');
                            $('.tabs-li').first().children().first().children().first().css('color', '');
                        }
                        $('.tabs-li').not(':first').each(function() {
                            $(this).children().first().css('background-color', '');
                            $(this).children().first().children().first().css('color', '');
                        });
                        this.firstChild.style.backgroundColor = 'rgb(197, 31, 0)';
                        this.firstChild.firstChild.style.color = 'rgb(255, 255, 255)';
                    }
                });
                if ($('.tabs-li').length) {
                    $('.tabs-li').first().trigger('click').trigger('mouseenter');
                    $('.tabs-li').first().children().first().css('background-color', '#C51F00').children().first().css('color', 'white');
                }
                $('.scrolling-left .arrow-left').css('display', 'none');
            }
        };
    elements.fn(elements.rightClickFn, elements.leftClickFn, elements.tabsClickAndPostingCall);
}

function POST(url) {
    'use strict';
    if (Object.prototype.toString.call(url) === '[object String]') {
        var request = new XMLHttpRequest();
        if (!~navigator.userAgent.indexOf('IE')) {
            request.overrideMimeType('application/json');
        }
        request.open('get', url, true);
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                var jsonObject = JSON.parse(request.responseText);
                if (jsonObject) {
                    $('body').trigger('post', jsonObject);
                }
            }
        };
        request.send();
    }
}

function getTabsNumber(jsonObject) {
    'use strict';
    var _tabsNumber = {},
        _length,
        _objectRouter = function(obj, flag) {
            if (!flag) {
                _length = Object.keys(obj).length;
                if (i in _tabsNumber) {
                    if (!({}).toString.call(_tabsNumber[i]) === '[object Array]') {
                        var _t = [];
                        _t.push(_tabsNumber[i]);
                        _t.push(_length);
                        _tabsNumber[i] = _t;
                    } else {
                        _tabsNumber[i].push(_length);
                    }
                } else {
                    _tabsNumber[i] = _length;
                }
            } else {
                for (var key in obj) {
                    if (({}).toString.call(obj[key] === '[object Object]')) {
                        _length = Object.keys(obj[key]).length;
                        if (_tabsNumber[key]) {
                            if (({}).toString.call(_tabsNumber[key]) !== '[object Array]') {
                                var _t = [];
                                _t.push(_tabsNumber[key]);
                                _t.push(_length);
                                _tabsNumber[key] = _t;
                            } else {
                                _tabsNumber[key].push(_length);
                            }
                        } else {
                            _tabsNumber[key] = _length;
                        }
                    }
                }
            }
        },
        _subRoutine = function(arr, flag) {
            for (var _i = arr.length; _i--;) {
                if (({}).toString.call(arr[_i]) === '[object Object]') {
                    for (var _key in arr[_i]) {
                        if (({}).toString.call(arr[_i][_key]) === '[object Object]' && !_tabsNumber[_key]) {
                            _objectRouter(arr[_i], true);
                        } else if (({}).toString.call(arr[_i][_key]) === '[object Array]') {
                            if (!_tabsNumber[_key]) {
                                _tabsNumber[_key] = 0;
                            }
                            _subRoutine(arr[_i][_key], true);
                        }
                    }
                }
            }
        };
    for (var i in jsonObject) {
        if (Object.prototype.toString.call(jsonObject[i]) === '[object Object]') {
            _objectRouter(jsonObject[i]);
        } else if (({}).toString.call(jsonObject[i]) === '[object Array]') {
            if (_tabsNumber[i]) {
                var _t = [];
                _t.push(_tabsNumber[i]);
                _t.push(0);
                _tabsNumber[i].push(_t);
            } else {
                _tabsNumber[i] = 0;
            }
            _subRoutine(jsonObject[i]);
        }
    }
    return _tabsNumber;
}
function getTasksNames(jsonObject) {
    'use strict';
    var _tasksNames = [],
        subRoutineArr = [],
        _subRoutine = function(arr, flag, _flag) {
            for (var i = 0; i < arr.length; i++) {
                if (({}).toString.call(arr[i]) === '[object Object]') {
                    for (var j in arr[i]) {
                        if (j && ({}).toString.call(j) === '[object String]' && ({}).toString.call(arr[i][j]) === '[object Object]') {
                            if (flag) {
                                if (!_t) {
                                    var _t = [];
                                    _t.push(j);
                                } else if (_t) {
                                    _t.push(j);
                                }
                                if (i === arr.length - 1 && _flag) {
                                    subRoutineArr.push(subRoutineArr.splice(subRoutineArr.length - 1, 1));
                                    subRoutineArr[subRoutineArr.length - 1].push(_t)
                                } else if (i === arr.length - 1) {
                                    subRoutineArr.push(_t);
                                }
                            } else {
                                subRoutineArr.push(j);
                            }
                        } else if (({}).toString.call(j) === '[object String]' && ({}).toString.call(arr[i][j]) === '[object Array]') {
                            typeof subRoutineArr[subRoutineArr.length - 1]
                            subRoutineArr.push(j);
                            if (typeof subRoutineArr[subRoutineArr.length - 1] === 'string' && typeof subRoutineArr[subRoutineArr.length - 2] === 'string') {
                                _subRoutine(arr[i][j], true, true);
                            } else {
                                _subRoutine(arr[i][j], true);
                            }
                        }
                    }
                }
            }
        };
    for (var i in jsonObject) {
        if (({}).toString.call(i) === '[object String]') {
            if (({}).toString.call(jsonObject[i]) === '[object Object]') {
                _tasksNames.push(i);
            } else if (({}).toString.call(jsonObject[i]) === '[object Array]') {
                var t = [];
                t.push(i);
                _subRoutine(jsonObject[i]);
                t.push(subRoutineArr);
                _tasksNames.push(t);
                subRoutineArr = [];
            }
        }
    }
    return _tasksNames;
}
var url,
    tasksNumber = false,
    tabsNumber,
    accordeon,
    taskNames,
    eventName;
if ('ontouchstart' in document) {
    eventName = 'touchstart';
} else {
    eventName = 'click';
}
$('document').ready(function() {
    'use strict';
    $('body').on('posting', function(e, _text, description) {
        if (description) {
            $('.details-body-entrails').css('display', 'none');
            if (description.match(/induction/i)) {
                $('.details-body-description')[0]['innerText' in $('.details-body-code')[0] ? 'innerText' : 'innerHTML'] = '';
                $('.details-body-description').append(_text);
            } else if (description.match(/description/i)) {
                $('.details-body-description')[0]['innerText' in $('.details-body-code')[0] ? 'innerText' : 'innerHTML'] = _text;
                $('.details-body-code')[0]['innerText' in $('.details-body-code')[0] ? 'innerText' : 'innerHTML'] = '';
                $('.details-body-entrails').css('display', 'none');
            } else if (description.match(/code/i)) {
                $('.details-body-description')[0]['innerText' in $('.details-body-code')[0] ? 'innerText' : 'innerHTML'] = '';
                $('.details-body-entrails').css('display', '');
                $('.details-body-code')[0]['innerText' in $('.details-body-code')[0] ? 'innerText' : 'innerHTML'] = _text;
            }
            if ($('.prettyprinted').length) {
                $('.prettyprinted').removeClass('prettyprinted');
            }
            prettyPrint();
        }
    });
    $('body').on('post', function(e, jsonObject) {
        var tabsNumberByKey = getTabsNumber(jsonObject),
            tasksNumber = (function() {
                var returnable = 0;
                for (var i in tabsNumberByKey) {
                    if (i && ({}).toString.call(tabsNumberByKey[i]) === '[object Number]') {
                        returnable += 1;
                    } else if (i && ({}).toString.call(tabsNumberByKey[i]) === '[object Array]') {
                        returnable += tabsNumberByKey[i].length;
                    }
                }
                return returnable;
            })(),
            taskNames = getTasksNames(jsonObject),
            accordeon = new Accordeon($('.accordeon-wrapper'), tasksNumber, 30, tabsNumberByKey),
            text,
            tabsNames = [];
        accordeon.build(taskNames);
        accordeon.scroller();
        $('.title').on(eventName, function(e) {
            'use strict';
            tabsNames = [];
            $('.columniser').css('border-bottom', 'initial');
            $('body').trigger('title-change');
            $('.details-body-code')[0]['innerText' in $('.details-body-code')[0] ? 'innerText' : 'innerHTML'] ? $('.details-body-code')[0]['innerText' in $('.details-body-entrails')[0] ? 'innerText' : 'innerHTML'] = '' : null;
            $('.details-body-description')[0]['innerText' in $('.details-body-code')[0] ? 'innerText' : 'innerHTML'] ? $('.details-body-description')[0]['innerText' in $('.details-body-code')[0] ? 'innerText' : 'innerHTML'] = '' : null;
            if (e.target.tagName === 'DIV') {
                text = e.target.firstChild['innerText' in e.target.firstChild ? 'innerText' : 'innerHTML'];
                if (text) {
                    $(e.target).prepend($('<div>', {
                        id: 'clickableTitleArrow',
                        html: '&#10147;',
                        style: 'display : inline; margin-left: 5%; font-size: 17px;'
                    }));
                    $('#clickableTitleArrow').parent().css('color', '#fff');
                    $('#clickableTitleArrow').parent().css('background-color', '#C51F00');
                }
            } else {
                text = e.target['innerText' in e.target.firstChild ? 'innerText' : 'innerHTML'];
                if (text && tabsNumberByKey[text]) {
                    $(e.target.parentNode).prepend($('<div>', {
                        id: 'clickableTitleArrow',
                        html: '&#10147;',
                        style: 'display : inline; margin-left: 5%; font-size: 17px;'
                    }));
                    $('#clickableTitleArrow').parent().css('color', '#fff');
                    $('#clickableTitleArrow').parent().css('background-color', '#C51F00');
                }
            }
            if (text in tabsNumberByKey && tabsNumberByKey[text]) {
                if (Object.prototype.toString.call(jsonObject[text]) === '[object Object]') {
                    for (var j in jsonObject[text]) {
                        tabsNames.push(j);
                    }
                } else {
                    var _subRoutine = function(arr) {
                        for (var i = arr.length; i--;) {
                            if (({}).toString.call(arr[i]) === '[object Object]') {
                                for (var k in arr[i]) {
                                    if (({}).toString.call(arr[i][k]) === '[object Object]') {
                                        if (k === text) {
                                            for (var _k in arr[i][k]) {
                                                tabsNames.push(_k);
                                            }
                                        }
                                    } else if (({}).toString.call(arr[i][k]) === '[object Array]') {
                                        _subRoutine(arr[i][k]);
                                    }
                                }
                            }
                        }
                    };
                    for (var q in jsonObject) {
                        if (({}).toString.call(jsonObject[q]) === '[object Array]') {
                            _subRoutine(jsonObject[q]);
                        }
                    }
                }
                $('.tabulator-wrapper').remove();
                $('.arrow-left').off(eventName);
                $('.arrow-right').off(eventName);
                $('.tabs-li').off(eventName);
                $('.scrolling-left').remove();
                $('.scrolling-right').remove();
                accordeon.tabulator(tabsNumberByKey[text], tabsNames, jsonObject, text);
                $('.columniser-text').first().append($('<div></div>', {
                    'style': 'float: left; padding: 1px 0px 0px 0px;',
                    'class': 'breadcrumb'
                }).append($('<span></span>', {
                    'style': 'background-color : #6690BC; border-top: 1px solid #C7C7C7; border-right: 1px solid #C7C7C7; padding-right: 5px;font-family: \'Segoe UI\'; font-size: 13px; cursor: pointer; color: #fff;'
                }).text($('.columniser-text').first().text())));

                $('.columniser-text').first().html($('.columniser-text').first().html().replace($('.columniser-text').first().html().match(/^(.*)<div/)[1], ''));

                $('.columniser-text:first div').prepend($('<div></div>', {
                    'style': 'float: left; display: inline-block; width: 0; height: 0; border-top-width: 7px; border-top-style: solid; border-top-color: rgba(0, 0, 0, 0); border-bottom-width: 10px; border-bottom-style: solid; border-bottom-color: rgba(0, 0, 0, 0); border-right-width: 10px; border-right-style: solid; border-right-color: #6690BC;'
                }));
                $('.titles-column-left').css('display', 'none');
                $('.details-body').css({
                    'margin-left': '9.5%'
                });
                $('.scrolling-right').css({
                    'left': ''
                });
                $('.columniser-text').first().on('click', function(e) {
                    $('.columniser').css('border-bottom', '1px solid #C51F00');
                    $('.details-body-description').html('');
                    $('.details-body-code').html('');
                    $('.left-right-container').before($('.columniser'));
                    $('.columniser').css('margin', '');
                    $('.titles-column-left').css('display', '');
                    $('.details-body').css({
                        'margin-left': ''
                    });

                    if ($('.columniser .columniser-text .breadcrumb').length) {
                        $('.columniser').prepend($('<div></div>', {
                            'class': 'columniser-text'
                        }).text($('.columniser-text:first span').text() ? $('.columniser-text:first span').text() : 'Induction Entries'));
                    }
                    if (!$(this).remove().length) {
                        $(e.target).remove();
                    }
                    $('.tabulator-wrapper').parent().remove();
                    $('.scrolling-left').remove();
                    $('.scrolling-right').remove();
                });
            }
            if (tabsNumberByKey[text] === 0 || !tabsNumberByKey[text]) {
                $('.tabulator-wrapper').remove();
                $('.arrow-left').off(eventName);
                $('.arrow-right').off(eventName);
                $('.tabs-li').off(eventName);
                $('.scrolling-left').css('display', 'none');
                $('.scrolling-right').css('display', 'none');
            } else {
                (function() {
                    var _width = 0;
                    $('.tabs-li div').each(function() {
                        _width += $(this).outerWidth();
                    })
                    if (_width < $('.tabulator-wrapper').outerWidth()) {
                        $('.scrolling-left').css('display', 'none');
                        $('.scrolling-right').css('display', 'none');
                    } else {
                        $('.scrolling-left').css('display', '');
                        $('.scrolling-right').css('display', '');
                    }
                })();
            }
        });
    });
    $(window).on('resize', function() {
        if ($('.title').has('#clickableTitleArrow').length) {
            $('.title').has('#clickableTitleArrow').click();
        }
    });
    /*!!this is main file for responsive page on Questionnaire!!*/
    url = 'js/tasks.js';
    POST(url);
});