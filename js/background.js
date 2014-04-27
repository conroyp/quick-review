/**
 * Try to display the plusone button
 * This will check if we're on an eligible page (PR or sub-page, comments etc)
 *
 * @return void
 */
function loadPlusOne(url)
{
    // Check that we're on an eligible url (/pull/[0-9]). If not, remove the
    // +1 box.
    // Why do we need this if we have chrome's url access policies? Because github
    // is big in to window.history rewriting and content injection for going back
    // over previously-viewed urls, which doesn't trigger a reload in chrome and
    // re-application of the content rules
    if (isEligibleUrl(url))
    {
        if (!$('#plusOneFooter').length)
        {
            $.get(chrome.extension.getURL('/html/button.html'), function(data) {
                // INject the html
                $($.parseHTML(data)).appendTo('body');

                // Inject click listener for the +1 button
                $('#plusOneFooter').on('click', function(){
                    plusOne();
                });

                // Inject click listener for all links to catch internal links, as
                // described above
                $('a').on('click', function(){
                    loadPlusOne($(this).attr('href'));
                });
            });
        }
    }
    else
    {
        $('#plusOneFooter').remove();
    }
}


/**
 * Check whether the given url matches our target format (some form
 * of PR page)
 *
 * @param string url URL string
 *
 * $return bool Whether the url is eligibile for our button or not
 */
function isEligibleUrl(url)
{
    return url.match(/\/pull\/([0-9]+)(\/?)/g);
}


/**
 * Try to add a :+1: to the PR.
 * May be on code diff, so trigger the comment tab first, then post the
 * comment.
 *
 * @return void
 */
function plusOne()
{
    // Could be on one of the non-comment tabs, so get on to the first tab first
    $('.js-pull-request-tab')[0].click();
    // Populate the comment
    $('textarea').val(':+1:');
    // Submit the form
    $('.js-new-comment-form').submit();
}


// Kick off initial load
loadPlusOne(document.URL);