(function() {
    var fs = require('fs');
    var $ = require('jquery')(require("jsdom").jsdom().parentWindow);
    var exec = require('exec-sync');


    console.log("\nBUG JSON:");
    console.log(parsePage(process.argv[2]));

    function parsePage(id) {
        var bug = {};
        var pgae = undefined;

        var pwd = exec('pwd');

        try {
            page = fs.readFileSync(pwd + '/tracker.tanglu.org/T' + id + '/index.html', {'encoding': 'utf8'});
        } catch(err) {
            // TODO: create a dummy bug
            return {}
        }

        bug.id = id;
        bug.title = $(page).find('.phui-header-view').contents().eq(1).text();
        bug.status = $(page).find('.phui-header-view').children('.phui-header-subheader').contents().eq(0).text();
        bug.visibility = $(page).find('.phui-header-view').children('.phui-header-subheader').contents().eq(1).text();
        bug.assigned = $(page).find("dt:contains('Assigned To')").next().text();
        bug.priority = $(page).find("dt:contains('Priority')").next().text();
        bug.author = $(page).find("dt:contains('Author')").next().text();
        bug.subscribers = $(page).find("dt:contains('Subscribers')").next().text(); // FIXME?
        bug.projects = $(page).find("dt:contains('Projects')").next().text(); // FIXME?
        bug.extern = $(page).find("dt:contains('External Issue')").next().text();

        bug.description = {};
        var _description = $(page).find(".phui-property-list-section-header:contains('Description'):last").next();
        var _desc_header = _description.find('p').eq(0).text();

        // The name is at the front
        bug.description.author = _desc_header.substring(0, _desc_header.indexOf('wrote') - 1);

        // Take the date and strip the trailing colon
        // TODO: Timezone?
        bug.description.date = _desc_header.substring(_desc_header.indexOf('on') + 3, _desc_header.length - 1);

        // bug description
        bug.description.content = _description.find('p').eq(1).text();

        var _timeline_items = $(page).find('.phui-timeline-view').find('.phui-timeline-shell');

        bug.timeline = [];
        _timeline_items.each(function (_item) {

            var comment = '';
            $(this).find('.phui-timeline-title').each(function (_action) {

                // put all actions from the same transaction into one comment
                comment += $(this).text() + '\n';
            });

            var _comment = $(this).find('.phui-timeline-core-content').find('p').text();

            // append the actual comment text if there is one
            if (_comment.length > 0) {
                comment += _comment;
            }

            bug.timeline.push(comment);
        });

        return bug;
    }

}) ();
