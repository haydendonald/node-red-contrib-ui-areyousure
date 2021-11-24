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
                storeFrontEndInputAsState: true,
                group: config.group,
                order: 0,
                width: 0,
                height: -1,
                convertBack: function (value) {
                    return value;
                },
                beforeSend: function (msg, orig) {
                    if (orig) {
                        return orig.msg;
                    }
                },

                //Setup the angular parameters
                initController: function ($scope, events) {
                    //Delete the generated elements
                    var deleteElement = function () {
                        try {
                            document.getElementById("are-you-sure-dialog").remove();
                        } catch (e) { }
                    }

                    //When a message comes on the input and is sent from before emit
                    $scope.$watch("msg", function (msg) {
                        console.log(msg);

                        if (!msg) { return; }
                        deleteElement();

                        //Add our element
                        var body = document.getElementsByTagName("body")[0];
                        var div = document.createElement("div");
                        var divStyle = String.raw`
                            z-index: 5;
                            width: 100vw;
                            height: 100vh;
                            top: 0;
                            left: 0;
                            background-color: ${msg.config.backgroundColor};
                            color: white;
                            display: none;
                            opacity: 0;
                            transition: opacity 0.5s;
                        `;
                        div.id = "are-you-sure-dialog";
                        div.style = divStyle;
                        div.innerHTML = String.raw`
                            <h1 style="font-size: 10vw; margin: 0; color: yellow"><i class="${msg.config.icon}"></i></h1>
                            <h1 style="color: ${msg.config.textColor}">${msg.config.title}</h1>
                            <h2 style="color: ${msg.config.textColor}">${msg.config.desc}</h2>
                            <p style="color: ${msg.config.textColor}">Will automatically select no in ${msg.config.timeoutSec} seconds</p>
                            <div style="height: 3vh"></div>
                        `;

                        var buttonStyle = String.raw`
                            width: 30vw;
                            height: 15vh;
                        `;

                        var yesButton = document.createElement("button");
                        yesButton.style.cssText = buttonStyle;
                        yesButton.innerHTML = "Yes";
                        yesButton.onclick = function(){$scope.send([msg, undefined]); deleteElement();};
                        var noButton = document.createElement("button");
                        noButton.style.cssText = buttonStyle;
                        noButton.innerHTML = "No";
                        noButton.onclick = function(){$scope.send([undefined, msg]); deleteElement();};

                        div.appendChild(yesButton);
                        div.appendChild(noButton);
                        body.appendChild(div);
                        document.getElementById("are-you-sure-dialog").style.display = "block";
                        setTimeout(function () { document.getElementById("are-you-sure-dialog").style.opacity = 1; }, 100);
                    });

                    deleteElement();
                },

                beforeEmit: function (msg, value) {
                    msg.config = config;
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