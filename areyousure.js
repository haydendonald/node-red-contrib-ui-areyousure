/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
module.exports = function (RED) {

    // var HTML = String.raw`<div style="width: 100%; height: 100%; opacity: 0; display: none; transition: opacity 0.5s;">`;

    // var optionButtonCSS = String.raw`
    //     width: 100%;
    //     padding: 0;
    //     margin: 0;
    //     margin-top: 2.5px;
    //     margin-bottom: 2.5px;
    // `;

    // //Add a button to the HTML
    // var addButton = function (value) {
    //     HTML += String.raw`
    //         <md-button 
    //             style='${optionButtonCSS} ${config.offClass == "" ? "background-color:" + value.offColor : ""}'
    //             ${config.offClass != "" ? "class=" + config.offClass : ""}
    //             ng-click="buttonClicked('${value.value}')"
    //             value="${value.value}" 
    //             oncolor="${value.onColor}" 
    //             offcolor="${value.offColor}" 
    //             onclass="${config.onClass || "disabled"}" 
    //             offclass="${config.offClass || "disabled"}">${value.label}
    //         </md-button>
    //     `;
    // }

    // HTML += String.raw`<div>`;

    // //Add the buttons for the values
    // var j = 0;
    // for (var i = 0; i < config.options.length; i++) {
    //     //If we go outside our height bounds move over to the next column
    //     if (j >= parseInt(config.height)) {
    //         HTML += String.raw`</div><div>`;
    //         j = 0;
    //     }
    //     addButton(config.options[i]);
    //     j++;
    // }

    // HTML += "</div></div>";
    // return HTML;


    var ui = undefined;
    function AreYouSure(config) {
        try {
            var node = this;
            if (ui === undefined) {
                ui = RED.require("node-red-dashboard")(RED);
            }

            RED.nodes.createNode(this, config);
            var done = ui.addWidget({
                node: node,
                format: "",
                templateScope: "local",
                emitOnlyNewValues: false,
                forwardInputMessages: false,
                storeFrontEndInputAsState: false,
                group: config.group,
                order: 0,
                width: 0,
                height: -1,
                convertBack: function (value) {
                    return value;
                },

                //When the click function is called
                beforeSend: function (msg, orig) {
                    if (orig) {
                        return orig.msg;
                    }
                },

                //Setup the angular parameters
                initController: function ($scope, events) {
                    //When a button is clicked
                    $scope.buttonClicked = function (value) {
                        $scope.send([{ payload: value }, undefined]);
                    }

                    //When a message comes on the input and is sent from before emit
                    $scope.$watch("msg", function (msg) {
                        if (!msg) { return; }

                        document.getElementById(id).style.display = "block";
                        setTimeout(function(){document.getElementById(id).style.opacity = 1;}, 100);
                    });


                    //Clean up any old elements
                    try {
                        document.getElementById(id).remove();
                    } catch (e) { }


                    var iconColor = "orange";
                    var textColor = "white";
                    var backgroundColor = "black";

                    var icon = "fa fa-exclamation-triangle";
                    var title = "Are yuuou surre";
                    var desc = "yolo";

                    var timeoutSec = 10;

                    //Add our element
                    var body = document.getElementsByTagName("body")[0];
                    var div = document.createElement("div");

                    var divStyle = String.raw`
                        z-index: 5;
                        width: 100vw;
                        height: 100vh;
                        top: 0;
                        left: 0;
                        background-color: ${backgroundColor};
                        color: white;
                        display: none;
                        opacity: 0;
                        transition: opacity 0.5s;
                    `;

                    div.id = id;
                    div.style = divStyle;

                    var buttonStyle = String.raw`
                        width: 30vw;
                        height: 15vh;
                    `;

                    div.innerHTML = String.raw`
                        <center>
                            <h1 style="font-size: 10vw; margin: 0; color: yellow"><i class="${icon}"></i></h1>
                            <h1 style="color: ${textColor}">${title}</h1>
                            <h2 style="color: ${textColor}">${desc}</h2>
                            <p style="color: ${textColor}">Will automatically select no in ${timeoutSec} seconds</p>
                            <div style="height: 3vh"></div>
                            <button style="${buttonStyle}" ng-click="click()">Yes</button>
                            <button style="${buttonStyle}">No</button>
                        </center>
                    `;
                    body.appendChild(div);

                    $scope.click = function() {
                        console.log("HI");
                    }
                },

                //When a message is on the input
                beforeEmit: function (msg, value) {
                    return { msg };
                }
            });

        }
        catch (e) {
            console.log(e);
        }
        node.on("close", done);
    }
    RED.nodes.registerType('ui_are_you_sure', AreYouSure);
};