import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

import ExpGraph from './ExpGraph.js';
import Viewer from './Viewer.js';

import { UsageLogs } from '../api/usageLogs.js';

image_prefix = "";
image_path = image_prefix + "";
// image_type = ".png";
image_type = ".jpg";
image_original = "";

// RADIUS_BIG1 = 135;
// RADIUS_SMALL1 = 75;
RADIUS_BIG1 = 100;
RADIUS_SMALL1 = 60;
dist = 28;

// App component - represents the whole app
export default class ExpGraphPage extends Component {

  _allData = [];
  _history = [];
  _historyLog = [];
  _dummyData = [];

  _dummyDataHist = [];
  _histShiftCounter = 0;

  _modelUrls = [];

  // for sample data
  constructor(props) {
    super(props);
    var domainX = [0,100];
    var domainY = [0,100];

    image_path = image_prefix + "/db_" + this.props.AppState.expId + "/";
    image_original = image_path + "1111" + image_type;

    inHistory = false;

    this.initData();

    this.state = {
      data: this.getData({x:domainX, y:domainY}),
      dummyData: this._dummyData,
      dummyDataHist: this._dummyDataHist,
      histShiftCounter: this._histShiftCounter,
      domain: {x:domainX, y:domainY},
      prevDomain: null,
      history: this.getHistory(),
    };

    this.loadModelUrls();

    this.props.saveLog(this.getCurrentNode().imageId,
        "initial node", this.getCurrentNode().id);
  }

  loadModelUrls() {
    // load 3d model urls
    var _self = this;
    var file = "/" + this.props.AppState.expId + "_modeldb.json";

    this.loadJSON(file, function(json) {
      _self._modelUrls = JSON.parse(json);
    });
  }

  loadJSON(file, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == 200) {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
  }

  findModelUrl(key) {
    for (var i=0; i<this._modelUrls.length; i++) {
      if (this._modelUrls[i].id == key) {
        return this._modelUrls[i].url
      }
    }
    return null;
  }

  initData() {

    var initialModelUrl = null;
    switch(this.props.AppState.expId) {
      case 'exp1':
        initialModelUrl1 = "https://create.bloomypro.com/embed/eyJpdiI6Ik54aXBkOUNWSEM0XC9VVDVDSndKalBnPT0iLCJ2YWx1ZSI6IkNGeEtDRU5PK0ZcL3ZOXC8zaDRCSHlNRHg0SDFXZ1RPS0h3eE5VSTZkRXZNb096d25ROGVnVUZmbVltT2ZpSVRMTFU1VTBKZlRGUWJ0XC9vNG9RUXpCaGxJakFPY3R3aHdXVVUxNVphaDFJXC9nSEM0OHJHYmQxaXhCXC9mRWZxbWtQZUkyYlkwcUdSTXI1T3pjVFNDMk8xSE1FRDJRU2hBNW1QQ0hySFZBc0NGaEFkcklWamk0R0lHQ0xFbkVGNTNVTWpOZmM2NUwzb2I0YVB1UXM0aXhTNmpOeVNWV2ZTRUVsdStUdHp0UHBGZTBWNE11R2JXYjFteFRvc29vRVlaY00raUVqTEpuaytqdDM4MTRCK3dkR3pDVHBHTXJpRktLK1VhXC9scjAzR0EyXC81VT0iLCJtYWMiOiJmYWYwMzAyMjNiNjE3ZWE3N2MwM2RjODZjOWU0NzA5NDI5YzY0MGMyYTMwOGRlZTk5YzE4OTQ0ZmIzZWNiY2U1In0=";
        initialModelUrl2 = "https://create.bloomypro.com/embed/eyJpdiI6IlNFTzdCNDhYT29cLzdXOWY2WlE2TUJBPT0iLCJ2YWx1ZSI6InFIT0U0RVo3MXF1Zm9KWXlnd2RKU1NtVytwcXFuR2RBalpKYjZMa3A5OWpGVjJuWnFzc0FNdXFFaG5zNEtXQmVOZFppV0lTY1Azc0REd1wvdCtpeVVWSDJTQlk1MUw0UlwvOEt3YVJIU29KdzBrSXQ3VVFnYUdsbmsydlpISGtLNnFJamZjcUxRMlhnWlwvZ3BrNmpjRFBoNTZFZ2d1VW05QnVBY2JpZ0JcLzZFOFU2YlBGTUlHZTg4eE16dkhyWmdycjFRT0VnNzMwazdQOWg2VDZJd0ZRaVdOZTFGbkRxQWpET1l3XC9KeXBBRGhYRVhxVTd0TU5TN0I4MDIxOFFcL1wva2NFc0RNcVVkRmJsN3diTzV0XC9zbkl1Mmpyc3RzdUl4elBTOXBjWFpON0FTWjQ9IiwibWFjIjoiZDRlNmE4ZDUzMDRiNjg4NTY2MzQ1YjZmYmE1Y2QwY2QxNTY4YTdlODg1ZTg0ZTNhZjEyMWIwZDYwMGUwNTJiYiJ9"; //2111
        initialModelUrl3 = "https://create.bloomypro.com/embed/eyJpdiI6Inp3WCtXYzlzVVp0VjhzNE1iZlNCMGc9PSIsInZhbHVlIjoiMHFLaTdGZkoxbXVDYnUzTklOcWZHenlLdlVuN1h0R1ZXSnpteDJITk1ucHl2K25INlN5eUNMd2YyaG5FQUdEdjlqQXgzQzQzVHlDQk1QU0czcVpOc3pwSjhPTkxcL3BXMHBTUVNvWGlIWEZ0SHR3Rmx3MTl2ZGE3bHJObUFhOThFSTNKUXlkM2k3bW01TkJjTmhNeVg2Y2NwbitXXC9WcElqcm5vMm1ZWkcyWDV1UGVBZVZPWGFjRVl0K2QwQVM3SlFcL3hZMHVtWURqdWEzTWhyb3dId1BmcVJqMWs1cGNMVmIwRmVYUzB2aTB0TDdlNTc2NUlMV05RempDUjJ6a3NhcHpoMjMxcGw2K0NWYnNOZmJDUUI3Sm9QUXNRV0M4eEpqQU1kb08wSlN3cDg9IiwibWFjIjoiMjljMjI0MjQzZTRmY2Q3NTlkNGNiNmU1M2RjMTkzMTgyNzY0MWViZTgwMDliMjA2Mjg2OWY4NDhhZDJlMDRhOSJ9"; //1211
        initialModelUrl4 = "https://create.bloomypro.com/embed/eyJpdiI6IitsckxLUU8yMVNDcGZWVlIyeGpKSFE9PSIsInZhbHVlIjoiWHRicmtBQWhSZjQ5aWRCWWJrY0N6S3hXMjV4MjlFUzc1OTVSbkhxUmxEYWJKVjlnTk9sSTlXeEs1WlhlV0Y5NzBuNmg3QWRwUTVPTXM2ZXJpcHUrSnRLdW9OVEVrXC9adVlcL2JrTVlTaTZ5cXBNS0VYZTdkdUtodUlhRmdGUjd5a2tJb1VsYXBzZkZUOVIzcG5TckVxVWd5Mk96ejBnd0dYb2o4MVREYTlaUTlqU2FjekE5dmVDYmJFTUxUOVoxanVRcHk4R3lsVmZaYVU5Qzkxb0V3OHFLSUZ0MDZmaGVBVW5IOWNFTWVDd2ZZMVJPcEo5VGV1VkFrZUJmczNIenYrd1wvSWs3ZWdrdkR5UmRsSDNqa0oxbGtZTG1jeEZLZWgwM1EzcUVVbHVrQkU9IiwibWFjIjoiOGQ2NjM0YWY4YTRiZmE4MDE5MmVmNGIyZjA4NDgwNDVjMWMxMTFkZjVlNGViZTgwZGI0NzFiMDA4MjMxZDkyZCJ9"; //1121
        initialModelUrl5 = "https://create.bloomypro.com/embed/eyJpdiI6InVRcjVMWTNNelA3M1NwbmJqbkFoaFE9PSIsInZhbHVlIjoiMUhtZjc2R2p5R3VGbXFSWEU2cVFYTHFYcFV2NEJMOHBqQTRNNDYwNThqemNXWGlrcnFMMUtjanduYW05K0JsQXNmQWNHcjV5OHY3YzVRQXJpdVZmZXRmXC9OdDFEQU9sUEE0RENNSGo4UGxaNDNINVptdWhiWUVpemQ4M2E1RTY2QWordExPNThITEpTRW92QXJnSE90ZXNmMVJseVR4UW1UcTRieVwvZ3F5NVZoRkM3MVFoT0JlU0lwbTh4RUVGc01yS2lDamxqXC83SzVHTnltRjFnRWF4Q3ZteWlMNG4wRnFleUY1R1FjRGR5RWtQbnVWcU1KVEo0ckN0YU9nanFXbXVDSXpZMXc0dmhERkJcL3FRODVQZGlNVUowQWtMY1BzU3JuajMxcGNpT1JzPSIsIm1hYyI6ImRkMzIzMjMyZWRjOTk4NGEzNDU3ZDkxZTY1NjFlZDliZDQyYjc5MTM1ZTkxNTY3NDdmYTZlOTAzNzhmZDc0ZGYifQ=="; //1112
        break;
      case 'exp2':
        initialModelUrl1 = "https://create.bloomypro.com/embed/eyJpdiI6IldQMk4rdExud3dUMGpWckhrRFAzN2c9PSIsInZhbHVlIjoiZk5TVTdkZHd3MmtkWnZWV3BaSWdxekw3aEF4U3BYS0VrXC9samdKdU5hbkdqVmMweThmMEpIaXRFWnBSR0ZSRDZqVmM2azNCRm1ldXIrRGtJUU9jdHFSa0ZRTDMwMnM5clwvUzV6aTgzV3VCWmRGWm50aEd2b3dsazc5dFY5cmlQYjNQY3RoTjJBcXk2RVVrTVVRNnlrZlJhUys3SGRmWWZ0QzFRR2hKRGdqeFVtVjdwMXJRREVENHB4MmdpWE1YYTNYcXVuamFsSDI5ZlhuQ3licXBcL1BvNFBweTlxeFBiTk5HOUxXK2ljUzl5d09XNGlKMzBISjNVQkFoS0liTHNmbENzY1EwZnlSZnM5UU1FazZ5WDVnVjBLMEFzUEdZaWRIK0M2NW42QkNmYmM9IiwibWFjIjoiNzU0YTFhYmY5MTBmMGVkYzQ0MjE1NDM2NGNjMzBiYTA5MjI0OGI2NzdjY2Q0OWMxOTM1MzhmNDc3MGIxOTllOCJ9";
        initialModelUrl2 = "https://create.bloomypro.com/embed/eyJpdiI6IkNPT21CQ1ZrRzgxUEwrV0I1XC9GNGhBPT0iLCJ2YWx1ZSI6InFwVWRrOFBZYkdkSmJMSDVaYkpnSlhMV1lHTDQrS05WSXNENHRUZ2YxeGFxWTF6NXpaQXBlM0ZzQkhoRmVmY0Y0a040WGxMdlhEazNxQU9rdUZvMnJYRDRBa0J0OVlcL2hvV0tFVThveTJXWm8ybkM1M2ozQ1BPS0o1emR1UFwvcDJcL2FrRHoxS09BWUdzXC9Kdk5aako0MVlUOXZrYnhkSkJoQ3l3VEhqZ3pHVGk2V1wvNk9Sa3RpbVVPQld6RlVaS1NVdjlMRkFReENkQlFscGhWRjJ4T0xCbnRcLzV6ZEZPSjIzZm0zQkFcLzhES1dNSkZlUzdXZHNmOEhRUmZSSWsra1krTWdmeGk4OGFIWFBjc2hYRGtCSTBFVHJkK3p4UFBIWFdCc2tsM09vOEZaND0iLCJtYWMiOiJiZmEzYzJmYzJjNGMyMjkwOWM4OTMyNTc2MTdhMjdjYzgzNDBmZDYwZDQyYWM1MjM4M2NiOTVhMTA4N2E0OTg4In0=";
        initialModelUrl3 = "https://create.bloomypro.com/embed/eyJpdiI6Im8wRjFSNVRsOU9kQ05HVG9ZcE9DWFE9PSIsInZhbHVlIjoia2EyVmViUTlMbWZRVmJ3N3RCMFZQeXlVa2x4YTU0dUh2TmhTb1YrcDZrT3E3bnFmWXdxUTNHdFhHeEtwZjExTWhmdmZLR2E2QTc1RkM5OFwvTkdwTGZDM1YwTFZ6ZHdhc3loNHVYTGE3elk3WGNhZmlETDBETGxPaGExNDRadDZKKzlpNG9zWEQrdHhRR2x2SU43YTRWdFFQMlBcL2RKUXhTTUhxR3BcL3JPcU95dU05dmlIVmZsYlg0TVVnbW5TdkZtNFwvN2ViZEZ1MXNDNk1ETm5vbFg0MzZZUGxTYzVkdXVLc3J5SWZvWTRqTkUxazVmK1ZoTUFIcjU5VmJZbWFEbWc3RnlkeVB0cW9zYmtEcEZUN0U5MmJkaFlCZTA4a1ZtYnRrSk4rK0wrZ1RJPSIsIm1hYyI6ImVjMDAyY2M0ZWU4YzZhZDA5ZWVlNWQ0ZTRkZWVkNGMxMjgzOTJmOWI1OGQxMmRiYTA0MzJhM2ZjYzczNDY4MWUifQ==";
        initialModelUrl4 = "https://create.bloomypro.com/embed/eyJpdiI6IkdqcUhYZWFzSmVTWnkyU1BsM1dWalE9PSIsInZhbHVlIjoiZ0ZKcTRrWU1uMDRzRUExTmtLTGtWNG91RnF1cGYxZ1hubGZmYXpqMGVpYjdMNmF6czh0Vld5MVwvV1p6WW9ZRnpCMjZOZysrcU4rSFFvdGlkczlVcGJMZmdwNDhIZVZCWUR5QjhvcHNseUVoM2NSZFJJTkQ1czgxZHplQkw0alMyTlUwak5tcThNdll6UHJhM1JPNjhHeUd3OG5EVGY0U0lSeVhCY3Npek1IMzI0SjBuRDI5NWJvempxNVE2RVFCZlhFN09YcjhpN3RucTZpWFpiSmM5NFNTY2dcL0tabzloUlwvMlU3VHdcL2RwelZIMlYwNXZUNkV5ZCs0NFFKRUU1YjBuME5EM0V1bENtd01XQWw3XC9KeERiREk2WHBTeTZVeVRkbjhBXC9IZzd4V0k9IiwibWFjIjoiMzk0MjgyNjZhZGEyNTA5MGI4YzIwYTkyYjBkNTZjMjIzZjM2MmZlNjU4NDcxZGY3NDJhMTM0NzQzNWVjMWE1MiJ9";
        initialModelUrl5 = "https://create.bloomypro.com/embed/eyJpdiI6IkFHTGdiOGN2TWozREdyVExnMWZWN3c9PSIsInZhbHVlIjoiTU1FekRkckdFN3IrTWExcnVmcG9yam5qdlNXQzY0WVQ5WkZZemx5RjFGMTVBVlZVUFVpekhOb041U0NiUEMrXC8yTnBPOTM1R2xvVlJZa2VpZEt4RHMwN2F0TWFYdnBDSWVUYURLUVFXNnpWWEJGbHBrYjh2azN0a0htRFlYNXB2VHRCc0NrSXE3RnFQTWI4ZGM0RzBMdUlMb1V4MlhBcDVXU2lFQzRZdmhkb1wvaHR0WnNNYVBDZm5KVzhCOW1kMXR2bmd1d3ZtNFNkRStTOURid0syMDRqcXB6STdGeFliaHQ2WDFBa0N4V0xVemlmbFFIeGk3WXhZT0xDdFcwWVhyN2NobWNQT3lCYUZTNUlnT1IxM3ZhME9taFJFS2VyeURFUlBrK2Erc29pdz0iLCJtYWMiOiI2OWVmYWJlNTAzYTE0NWU4NDJiZTBlYjc0ODEyNDkyZDY2Yjk1ZjllODI3NmEwMTMyNWU0YmE3NjM2N2ZkOTg4In0=";
        break;
      default:
        initialModelUrl1 = "";
        initialModelUrl2 = "";
        initialModelUrl3 = "";
        initialModelUrl4 = "";
        initialModelUrl5 = "";
    }
    // initialize variables
    this._allData = [
      {x: 50, y: 50, z: RADIUS_BIG1,
        id: 'd1',
        parentId: 'd',
        parentX: 50, parentY: 50,
        numChildren: 4,
        focused: true, saved: false, displayed: true,
        imageId: 1111,
        image: image_path + "1111" + image_type,
        modelUrl: initialModelUrl1,
      },
    ];

    var parentId = parseInt(1111);
    var childrenImageId = this.getChildrenImageId(parentId);

    this._allData.push(
      {x: 50-dist, y: 50+dist, z: RADIUS_SMALL1,
        id: 'd11',
        parentId: 'd1',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, saved: false, displayed: true,
        imageId: childrenImageId[0],
        image: image_path + childrenImageId[0] + image_type,
        modelUrl: initialModelUrl2,
      },
      {x: 50-dist, y: 50-dist, z: RADIUS_SMALL1,
        id: 'd12',
        parentId: 'd1',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, saved: false, displayed: true,
        imageId: childrenImageId[1],
        image: image_path + childrenImageId[1] + image_type,
        modelUrl: initialModelUrl3,
      },
      {x: 50+dist, y: 50+dist, z: RADIUS_SMALL1,
        id: 'd13',
        parentId: 'd1',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, saved: false, displayed: true,
        imageId: childrenImageId[2],
        image: image_path + childrenImageId[2] + image_type,
        modelUrl: initialModelUrl4,
      },
      {x: 50+dist, y: 50-dist, z: RADIUS_SMALL1,
        id: 'd14',
        parentId: 'd1',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, saved: false, displayed: true,
        imageId: childrenImageId[3],
        image: image_path + childrenImageId[3] + image_type,
        modelUrl: initialModelUrl5,
      },
    );

    this._history = [
      this._allData[0]
    ];

    this._historyLog = [];

    this._dummyData = [
      {x: 10, y: 90, z: 30, // 30/50
        id: 'Color',
        id_de: 'Farbe',
        parentId: 'd0',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, saved: false, displayed: false,
        imageId: "_01",
        image: image_path + "_01.jpg",
      },
      {x: 10, y: 10, z: 30, // 30/50
        id: 'Texture',
        id_de: 'Textur',
        parentId: 'd0',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, saved: false, displayed: false,
        imageId: "_02",
        image: image_path + "_01.jpg",
      },
      {x: 90, y: 10, z: 30, // 30/50
        id: 'Space',
        id_de: 'Abstand',
        parentId: 'd0',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, saved: false, displayed: false,
        imageId: "_03",
        image: image_path + "_01.jpg",
      },
      {x: 90, y: 90, z: 30, // 30/50
        id: 'Form',
        id_de: 'Form',
        parentId: 'd0',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, saved: false, displayed: false,
        imageId: "_04",
        image: image_path + "_01.jpg",
      },
    ];

    this._dummyDataHist = [
        {x: 90, y: 0, z: 20,
          id: 'left',
          // parentId: 'd0',
          parentX: 50, parentY: 50,
          numChildren: 0,
          focused: false, saved: false, displayed: false,
          imageId: "_01",
          image: image_path + "_02.png",
        },
        {x: 95, y: 0, z: 50,
          id: 'right',
          // parentId: 'd0',
          parentX: 50, parentY: 20,
          numChildren: 0,
          focused: false, saved: false, displayed: false,
          imageId: "_02",
          image: image_path + "_01.png",
        },
      ];

    this._histShftCounter = 0;
  }

  getData(domain) {
    return _.filter(this._allData, this.isInDomain.bind(null, domain));
  }

  isInDomain(domain, d) {
    return d.displayed == true;
  }

  getHistory() {
    return this._history;
  }

  getHistShitCounter() {
    return this._histShftCounter;
  }

  getCurrentNode() {
    // return this._history[this._history.length-1];
    return this._allData.filter( obj => obj.focused===true )[0];
  }

  handleNodeClick(domain, d) {
    if (d.focused === false) {

      if (inHistory == true) {
        var children = this._allData.filter( obj => obj.id.length > d.id.length );
        this.pruneChildren(children);

        // update history
        for (var i=this._history.length-1; i>=0; i--) {
          if (this._history[i].id == d.parentId) {
            break;
          }
          this._history = this._history.slice(0,i);
        }
        inHistory = false;
      }

      // save log
      var direction = "default";
      var x = d.x - this.state.domain.x[0];
      var y = d.y - this.state.domain.y[0];
      if (x<=50 && d.y<=50)      direction = "TEXTURE";
      else if (x>50 && y<50) direction = "SPACE";
      else if (x<50 && y>50) direction = "COLOR";
      else if (x>50 && y>50) direction = "FORM";
      this.props.saveLog(d.imageId, "click "+direction, d.id);

      d.z = RADIUS_BIG1;
      d.focused = true;
      this._history.push(d);

      this._allData.filter( obj => obj.id===d.parentId)[0].focused = false;
      this._allData.filter( obj => obj.id===d.parentId)[0].displayed = false;

      var currentChildren = this._allData.filter( obj => obj.parentId===d.parentId);
      for (var i=0, len=currentChildren.length; i<len; i++) {
        if (currentChildren[i].id != d.id) {
          currentChildren[i].displayed = false;
        }
      }

      // this._histShftCounter = 0;
      if (this.state.history.length - this._histShftCounter >= 11) {
        this._histShftCounter = this.state.history.length - 11;
      }
      else if (this.state.history.length < 11) {
        this._histShftCounter = 0;
      }

      this.shiftPane(d);
      this.generateChildren(domain, d);
    }
    // else if (d.focused === true) {
    // }
  }

  shiftPane(d) {
    var newDomainX = [d.x-50, d.x+50];
    var newDomainY = [d.y-50, d.y+50];
    this.setAppState({
      data: this.getData({x:newDomainX, y:newDomainY}),
      domain: _.assign({}, this.state.domain, {
        x: newDomainX,
        y: newDomainY,
      }),
      prevDomain: null,
      history: this.getHistory(),
      histShiftCounter: this.getHistShitCounter(),
    });
  }

  generateChildren(domain, d) {
    childNum = [d.numChildren+1, d.numChildren+2, d.numChildren+3, d.numChildren+4];
    d.numChildren = d.numChildren+4;

    var parentId = parseInt(d.imageId);
    var childrenImageId = this.getChildrenImageId(parentId);

    this._allData.push(
      {x: d.x-dist, y: d.y+dist, z: RADIUS_SMALL1,
        id: d.id+childNum[0],
        parentId: d.id,
        parentX: d.x, parentY: d.y,
        numChildren: 0,
        focused: false, saved: false, displayed: true,
        imageId: childrenImageId[0],
        image: image_path + childrenImageId[0] + image_type,
        modelUrl: this.findModelUrl(childrenImageId[0]),
      },
      {x: d.x-dist, y: d.y-dist, z: RADIUS_SMALL1,
        id: d.id+childNum[1],
        parentId: d.id,
        parentX: d.x, parentY: d.y,
        numChildren: 0,
        focused: false, saved: false, displayed: true,
        imageId: childrenImageId[1],
        image: image_path + childrenImageId[1] + image_type,
        modelUrl: this.findModelUrl(childrenImageId[1]),
      },
      {x: d.x+dist, y: d.y+dist, z: RADIUS_SMALL1,
        id: d.id+childNum[2],
        parentId: d.id,
        parentX: d.x, parentY: d.y,
        numChildren: 0,
        focused: false, saved: false, displayed: true,
        imageId: childrenImageId[2],
        image: image_path + childrenImageId[2] + image_type,
        modelUrl: this.findModelUrl(childrenImageId[2]),
      },
      {x: d.x+dist, y: d.y-dist, z: RADIUS_SMALL1,
        id: d.id+childNum[3],
        parentId: d.id,
        parentX: d.x, parentY: d.y,
        numChildren: 0,
        focused: false, saved: false, displayed: true,
        imageId: childrenImageId[3],
        image: image_path + childrenImageId[3] + image_type,
        modelUrl: this.findModelUrl(childrenImageId[3]),
      },
    );

    this.setAppState({
      data: this.getData(this.state.domain),
      prevDomain: null
    });

  }

  getChildrenImageId (parentId) {
    var childrenId = [parentId+1000, parentId+100, parentId+10, parentId+1];

    for (var i=0; i<childrenId.length; i++) {
      childrenId[i] = childrenId[i].toString().replace("4", "1");
    }

    return childrenId;
  }

  handleHistoryClick (domain, d) {
    // var children = this._allData.filter( obj => obj.id.length > d.id.length );
    // this.pruneChildren(children);

    // save log
    this.props.saveLog(d.imageId, "history click", d.id);

    for (var i=0; i<this._allData.length; i++) {
      this._allData[i].focused = false;
      this._allData[i].displayed = false;
      this._allData[i].z = RADIUS_SMALL1;
    }

    d.focused = true;
    d.displayed = true;
    d.z = RADIUS_BIG1;
    d.numChildren = 0;

    // store history
    this._historyLog.push(Object.assign({}, this._history));

    inHistory = true;

    this.shiftPane(d);
    this.displayChildren(d);

    // console.log("focused:", d.focused, " saved:", d.saved);
  }

  displayChildren (d) {
    var children = this._allData.filter( obj => obj.parentId == d.id );
    for (var i=0; i<children.length; i++) {
      children[i].displayed = true;
    }

    this.setAppState({
      data: this.getData(this.state.domain),
      prevDomain: null,
    });
  }

  pruneChildren(children) {
    for (var i=0, len=children.length; i<len; i++) {
      this._allData = _.reject(this._allData, {id: children[i].id});
    }

    this.setAppState({
      data: this.getData(this.state.domain),
      prevDomain: null,
    });
  }

  setAppState(partialState, callback) {
    return this.setState(partialState, callback);
  }

  handleDummyHistClick(domain, d) {
    if (d.id==="left") {
      if (this._histShftCounter > 0)
        this._histShftCounter--;
    }
    else if (d.id==="right") {
      if (this.state.history.length - this._histShftCounter > 11)
        this._histShftCounter++;
    }

    this.props.saveLog("-", "history navigate "+d.id, "-");
    // console.log(this._histShftCounter);
    this.setAppState({
      histShiftCounter: this.getHistShitCounter(),
    });
  }

  handleClickSave() {
    var currentNode = this.getCurrentNode();
    if (currentNode.saved==false) {
      currentNode.saved = true;
      this.props.saveLog(currentNode.imageId, "save design", currentNode.id);
      // console.log(currentNode.imageId, "save design ("+currentNode.id+")");
      // alert("Design saved. Saved designs will be shown in red circles in the history.");
      alert("Design gespeichert. Gespeicherte Designs werden in der Historie in roten Kreisen angezeigt.");

      var fromHistory = this._history.filter( obj => obj.id == currentNode.id );
      for (var i=0; i<fromHistory.length; i++) {
        fromHistory[i].saved = true;
      }
    }
    else {
      currentNode.saved = false;
      this.props.saveLog(currentNode.imageId, "unsave design", currentNode.id);
      // console.log(currentNode.imageId, "unsave design ("+currentNode.id+")");
      alert("Design nicht gespeichert.");
      // alert("Design unsaved.");

      var fromHistory = this._history.filter( obj => obj.id == currentNode.id );
      for (var i=0; i<fromHistory.length; i++) {
        fromHistory[i].saved = false;
      }
    }

    this.setAppState({
      data: this.getData(this.state.domain),
      prevDomain: null,
    });

  }

  renderTaskDescription() {
    var taskDescription = "";
    switch(this.props.AppState.expId) {
      case "trial":
        // taskDescription = "Task description: Find red dotted squares that are tightly-spaced in linear formation.";
        taskDescription = "Aufgabenbeschreibung: Finden Sie rot gestrichelte Felder, die in einer Reihe angeordnet, eng beieinander liegen.";
        break;
      case "exp1":
        // taskDescription = "Task description: Mrs. Heinrich, an 80-year-old regular customer, would like to buy a bouquet for her birthday party. The bouquet should stand on the dining table. The apartment is furnished in a romantic style. Her birthday is in summer.";
        taskDescription = "Aufgabenbeschreibung: Frau Heinrich, eine 80-jährige Stammkundin, möchte gerne einen Blumenstrauss zum Anlass ihrer Geburtstagsfeier kaufen. Der Blumenstrauss soll auf dem Esstisch stehen. Die Wohnung ist im romantischen Stiel eingerichtet. Ihr Geburtstag ist im Sommer.";
        break;
      case "exp2":
        // taskDescription = "Task description: A young woman enters your shop, whom you have not seen before. She is interested in a round hand-bound bridal bouquet. The wedding will take place at the end of May and the bride will wear white. She informs them that she likes natural flowers and the colour purple.";
        taskDescription = "Aufgabenbeschreibung: Eine junge Frau betritt Ihren Laden, die sie zuvor noch nicht gesehen haben. Sie ist an einem Hochzeitsblumenstrauss interessiert. Die Hochzeit findet im Mai statt und die Braut wird weiss tragen. Sie informiert sie, dass natürliche Blumen und die Farbe Lila mag.";
      default:
        break;
    }
    return (taskDescription);
  }

  render() {
    return (
      <div className="containder">
        <div className="description">
          {this.renderTaskDescription()}
        </div>
        <div className="subContainer">
          <ExpGraph
            width={this.props.graphWidth}
            height={this.props.height}
            appState={this.state}
            setAppState={this.setAppState.bind(this)}
            handleNodeClick={this.handleNodeClick.bind(this)}
            handleHistoryClick={this.handleHistoryClick.bind(this)}
            handleDummyHistClick={this.handleDummyHistClick.bind(this)}
          />

          <Viewer
            width={this.props.viewerWidth}
            height={this.props.height}
            appState={this.state}
            getCurrentNode={this.getCurrentNode.bind(this)}
          />
        </div>

        <div className="description">
          <button className="button" onClick={this.handleClickSave.bind(this)}>
            {/* Save/Unsave this design */}
            Dieses Design speichern/aufheben
          </button>
          <button className="button" onClick={this.props.handleClickReturnToMenu.bind(this)}>
            {/* Return to menu */}
            Zurück zum Menü
          </button>
          <button className="button" onClick={this.props.handleClickExit.bind(this)}>
            {/* Exit */}
            Beenden
          </button>
        </div>
      </div>

    );
  }

}
