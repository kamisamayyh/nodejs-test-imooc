/**
 * Created by SoRa on 2016/11/14 0014.
 */
$(function(){

    $('.comment').click(function(){

        var target = $(this);
        var toId = target.data('tid');
        var commentId = target.data('cid');
        if($("#toId").length){
            $("#toId").val(toId);
        }
        else
        $('<input>').attr({
            type: 'hidden',
            id:'toId',
            name: 'comment[tid]',
            value : toId
        }).appendTo('#commentForm');
        if($("#commentId").length)
            $("#commentId").val(toId);
        else
        $('<input>').attr({
            type: 'hidden',
            id:'commentId',
            name: 'comment[cid]',
            value : commentId
        }).appendTo('#commentForm');
    })
})