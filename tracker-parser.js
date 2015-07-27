(function() {
    var fs = require('fs');
    var $ = require('jquery')(require("jsdom").jsdom().parentWindow);
    var exec = require('exec-sync');

    var out = [];

    for (var i = 1; i < 145; i++) {
        out.push(parsePage(i));
    }
    console.log("%j", out);

    //console.log(parsePage(process.argv[2]));

    function parsePage(id) {
        var bug = {};
        var pgae = undefined;

        var pwd = exec('pwd');

        try {
            page = fs.readFileSync(pwd + '/tracker.tanglu.org/T' + id + '/index.html', {'encoding': 'utf8'});
        } catch(err) {
            bug.id = id;
            bug.title = "Dummy Bug";
            bug.status = 'Closed, Resolved';
            bug.visibility = 'Public ';
            bug.assigned = 'ximion';
            bug.priority = 'Low';
            bug.author = 'ximion';
            bug.subscribers = '';
            bug.projects = [];
            bug.description = "This bug was lost in a server failure";
            bug.timeline = [];

            return bug;
        }

        bug.id = id;
        bug.title = $(page).find('.phui-header-view').contents().eq(1).text();
        bug.status = $(page).find('.phui-header-view').children('.phui-header-subheader').contents().eq(0).text();
        bug.visibility = $(page).find('.phui-header-view').children('.phui-header-subheader').contents().eq(1).text();
        bug.assigned = $(page).find("dt:contains('Assigned To')").next().text();
        bug.priority = $(page).find("dt:contains('Priority')").next().text();
        bug.author = $(page).find("dt:contains('Author')").next().text();
        bug.subscribers = $(page).find("dt:contains('Subscribers')").next().text(); // FIXME?
        bug.projects = []
        $(page).find("dt:contains('Projects')").next().find('.phabricator-handle-tag-list').each(function(item) {
            bug.projects.push($(this).find('.phui-tag-view').text());
        });
        bug.extern = $(page).find("dt:contains('External Issue')").next().text();

        bug.description = $(page).find(".phui-property-list-section-header:contains('Description'):last").next().text();

        var _timeline_items = $(page).find('.phui-timeline-view').find('.phui-timeline-shell');

        bug.timeline = [];
        _timeline_items.each(function (_item) {

            var comment = '';
            $(this).find('.phui-timeline-title').each(function (_action) {

                // put all actions from the same transaction into one comment
                comment += $(this).text() + '\n';
            });

            var _comment = $(this).find('.phui-timeline-core-content').text();

            // append the actual comment text if there is one
            if (_comment.length > 0) {
                comment += _comment;
            }

            bug.timeline.push(comment);
        });

        return bug;
    }

}) ();
