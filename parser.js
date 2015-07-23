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

    bug.description = {};
    var _description = $(page).find("div:contains('Description'):last").next();
    var _desc_header = _description.find('p').eq(0).text();

    // The name is at the front
    bug.description.author = _desc_header.substring(0, _desc_header.indexOf('wrote') - 1);

    // Take the date and strip the trailing colon
    // TODO: Timezone?
    bug.description.date = _desc_header.substring(_desc_header.indexOf('on') + 3, _desc_header.length - 1);

    // bug description
    bug.description.content = _description.find('p').eq(1).text();

    console.log(bug);
}) ();
