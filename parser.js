(function() {
    var fs = require('fs');
    var $ = require('jquery')(require("jsdom").jsdom().parentWindow);

    var page = fs.readFileSync('/home/yofel/dump/tanglu/cache-dl/tracker.tanglu.org/T1/index.html', {'encoding': 'utf8'});
    var bug = {};

    bug.id = 1;
    bug.title = $(page).find('.phui-header-view').contents().eq(1).text();
    bug.status = $(page).find('.phui-header-view').children('.phui-header-subheader').contents().eq(0).text();
    bug.visibility = $(page).find('.phui-header-view').children('.phui-header-subheader').contents().eq(1).text();
    bug.assigned = $(page).find("dt:contains('Assigned To')").next().text();
    bug.priority = $(page).find("dt:contains('Priority')").next().text();
    bug.author = $(page).find("dt:contains('Author')").next().text();
    bug.subscribers = $(page).find("dt:contains('Subscribers')").next().text(); // FIXME?
    bug.projects = $(page).find("dt:contains('Projects')").next().text(); // FIXME?


    console.log(bug);
}) ();
