(this["webpackJsonpHiFi-DeFi"]=this["webpackJsonpHiFi-DeFi"]||[]).push([[31],{1168:function(e,t,n){"use strict";n.r(t);var a=n(2),c=n(15),r=n(24),s=n(0),i=n(645),l=n(65),o=n(126),d=n(646),u=n(647),j=n(644),m=n(519),b=n(571),x=n.n(b),h=n(1104),O=n.n(h),v=n(43),p=n(442),f=n(116),k=n(217),g=n(1141),N=n(1144),w=n(1143),y=n(1142),S=n(1102),F=n.n(S),C=n(1),I=function(e){var t=e.open,n=e.handleClose,a=e.levelTrack,c=e.currentLevel;return Object(C.jsxs)(g.a,{fullWidth:!0,maxWidth:"sm",open:t,onClose:n,"aria-labelledby":"max-width-dialog-title",className:"levelTrackModal",children:[Object(C.jsx)(y.a,{id:"max-width-dialog-title",style:{textAlign:"center"},children:"Level Rewards"}),Object(C.jsx)(w.a,{className:"body",children:Object(C.jsx)(p.a,{container:!0,children:(null===a||void 0===a?void 0:a.length)>0&&a.map((function(e){var t,n;return Object(C.jsxs)(p.a,{item:!0,container:!0,lg:12,md:12,sm:12,xs:12,children:[Object(C.jsx)(p.a,{item:!0,lg:2,md:2,sm:2,xs:2,className:"progressColumn",children:Object(C.jsx)("div",{className:"progressLight ".concat(c>=e.level?"active":""),children:Object(C.jsx)("div",{className:"progressBobble"})})},Object(i.a)()),Object(C.jsxs)(p.a,{item:!0,lg:10,md:10,sm:10,xs:10,className:"levelInfoColumn ".concat(c>=e.level?"active":""),children:[Object(C.jsxs)(p.a,{item:!0,lg:12,md:12,sm:12,xs:12,className:"level",children:["Level ",e.level]}),Object(C.jsxs)(p.a,{item:!0,lg:12,md:12,sm:12,xs:12,className:"xpReq",children:["XP Required: ",e.xpRequirement]}),(null===(t=e.perks)||void 0===t?void 0:t.length)>0&&Object(C.jsx)(p.a,{item:!0,lg:12,md:12,sm:12,xs:12,className:"perks",children:Object(C.jsxs)(C.Fragment,{children:["Perks",(null===(n=e.perks)||void 0===n?void 0:n.length)>0&&e.perks.map((function(e){return Object(C.jsxs)(p.a,{item:!0,lg:12,md:12,sm:12,xs:12,className:"perk",children:[Object(C.jsx)(F.a,{className:"icon"}),Object(C.jsx)("span",{className:"description",children:e.description})]},Object(i.a)())}))]})}),Object(C.jsx)("hr",{})]},Object(i.a)())]},Object(i.a)())}))})}),Object(C.jsx)(N.a,{children:Object(C.jsx)(m.a,{onClick:n,color:"primary",children:"Close"})})]})},W=n(1103),T=n(1160),P=n(632),D=n(44),M=n(48),L=n(67),B=function(e){var t=Object(s.useState)(!1),n=Object(r.a)(t,2),i=n[0],o=n[1],d=Object(s.useState)(!1),u=Object(r.a)(d,2),b=u[0],h=u[1],O=Object(W.b)(),v=O.control,k=O.setValue,S=e.open,F=e.handleClose,I=e.stakingOption,B=e.minDepositAmount,H=e.nftIndex,A=e.tokenBalance,U=Object(s.useState)(0),V=Object(r.a)(U,2),Y=V[0],R=V[1],q=Object(l.c)(),$=q.account,z=q.chainId,E=""!==(null===I||void 0===I?void 0:I.bonus)&&"None"!==(null===I||void 0===I?void 0:I.bonus),X=function(){var e=Object(c.a)(Object(a.a)().mark((function e(){var t,n;return Object(a.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.t0=!$||!z,e.t0){e.next=5;break}return e.next=4,Object(M.a)();case 4:e.t0=!e.sent;case 5:if(!e.t0){e.next=8;break}return f.b.error("Unsupported network. Please Change Network"),e.abrupt("return");case 8:if(!(Number(Y)+(Number.parseInt(null===I||void 0===I?void 0:I.currentlyStaked,10)||0)<Number(B))){e.next=11;break}return f.b.error("Stake amount must be greater than ".concat(B)),e.abrupt("return");case 11:return e.prev=11,o(!0),t=Object(M.n)(),n=Object(D.e)(Y),e.next=17,Object(M.c)(n,$);case 17:return e.next=19,t.methods.deposit(I.index,L.d,Number(H),n).send({from:$});case 19:f.b.success("Successfully staked ".concat(Y," tokens")),o(!1),setTimeout((function(){window.location.reload()}),1e3),e.next=27;break;case 24:e.prev=24,e.t1=e.catch(11),f.b.error(e.t1.message?e.t1.message:"Transaction Failed. Please make sure you have sufficient balance and Minimum Balance");case 27:o(!1);case 28:case"end":return e.stop()}}),e,null,[[11,24]])})));return function(){return e.apply(this,arguments)}}(),J=function(){var e=Object(c.a)(Object(a.a)().mark((function e(){var t,n,c,r,s,i,l,o,d;return Object(a.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=v._formValues.WithdrawAmount,e.t0=!$||!z,e.t0){e.next=6;break}return e.next=5,Object(M.a)();case 5:e.t0=!e.sent;case 6:if(!e.t0){e.next=9;break}return f.b.error("Unsupported network. Please Change Network"),e.abrupt("return");case 9:if(!(t<0)){e.next=12;break}return f.b.error("Withdraw amount must be greater than 0"),e.abrupt("return");case 12:if(!(t>Number(I.currentlyStaked))){e.next=15;break}return f.b.error("Insufficient Balance to withdraw."),e.abrupt("return");case 15:if(!(0!==(n=Number(I.currentlyStaked)-Number(t))&&n<Number(B))){e.next=19;break}return f.b.error("Withdrawal Error - you must either empty the pool or leave at least ".concat(Number(B)," $HiFi in the pool")),e.abrupt("return");case 19:return e.prev=19,h(!0),c=Object(M.n)(),r=Object(D.e)(t),e.next=25,Object(M.c)(r,$);case 25:return e.next=27,c.methods.getUserPoolsForNFT($,L.d,Number(H)).call();case 27:s=e.sent,i=0,l=0;case 30:if(!(l<s.length)){e.next=39;break}return o=s[l],e.next=34,c.methods.pools(Number(o)-1).call();case 34:d=e.sent,Number(d.stakingOption)===I.index&&(i=o);case 36:l++,e.next=30;break;case 39:return e.next=41,c.methods.withdraw(i,r).send({from:$});case 41:f.b.success("Successfully withdrawn ".concat(r," tokens")),h(!1),setTimeout((function(){window.location.reload()}),1e3),e.next=49;break;case 46:e.prev=46,e.t1=e.catch(19),f.b.error(e.t1.message?e.t1.message:"Transaction Failed. Please make sure you have sufficient balance and Minimum Balance");case 49:h(!1);case 50:case"end":return e.stop()}}),e,null,[[19,46]])})));return function(){return e.apply(this,arguments)}}();return Object(C.jsxs)(g.a,{fullWidth:!0,maxWidth:"sm",open:S,onClose:F,"aria-labelledby":"max-width-dialog-title",className:"NFTStakingModal",children:[Object(C.jsx)(y.a,{id:"max-width-dialog-title",className:"title",children:"Stake / Unstake to NFT"}),Object(C.jsxs)(w.a,{children:[Object(C.jsxs)(p.a,{container:!0,direction:"row",justifyContent:"center",alignItems:"center",children:[Object(C.jsx)(p.a,{item:!0,lg:12,md:12,sm:12,xs:12,children:Object(C.jsxs)("div",{className:"stakingOptionName",children:[null===I||void 0===I?void 0:I.vestingPeriod,E&&Object(C.jsxs)(C.Fragment,{children:[" - ",null===I||void 0===I?void 0:I.bonus," Bonus XP"]})]})}),Object(C.jsx)(p.a,{item:!0,xs:!0,children:Object(C.jsx)(j.a,{m:2,children:Object(C.jsx)(T.a,{margin:"dense",label:"HiFi Balance",fullWidth:!0,value:parseFloat(null===A||void 0===A?void 0:A.toLocaleString(void 0,{minimumFractionDigits:2})),InputProps:{readOnly:!0}})})}),Object(C.jsx)(p.a,{item:!0,xs:!0,children:Object(C.jsx)(j.a,{m:2,children:Object(C.jsx)(T.a,{margin:"dense",label:"HiFi Staked",fullWidth:!0,value:Number(null===I||void 0===I?void 0:I.currentlyStaked)||0,InputProps:{readOnly:!0},onClick:function(){(Number(null===I||void 0===I?void 0:I.currentlyStaked)||0)>0&&k("WithdrawAmount",null===I||void 0===I?void 0:I.currentlyStaked)},className:"stakedAmount"})})})]}),Object(C.jsxs)(p.a,{container:!0,direction:"row",justifyContent:"center",alignItems:"center",children:[Object(C.jsx)(p.a,{item:!0,xs:!0,children:Object(C.jsxs)(j.a,{m:2,children:[Object(C.jsx)(T.a,{autoFocus:!0,margin:"dense",label:"Stake Amount",fullWidth:!0,type:"number",value:Y,onChange:function(e){return R(e.target.value)},InputProps:{inputMode:"numeric",pattern:"[0-9]*",inputProps:{min:Number.parseInt(B,10)}},helperText:"Stake at least ".concat(Number.parseInt(B,10))}),Object(C.jsx)(m.a,{onClick:X,variant:"contained",color:"secondary",children:i?Object(C.jsx)(C.Fragment,{children:Object(C.jsx)(P.a,{color:"primary",size:20})}):"Stake"})]})}),Object(C.jsx)(p.a,{item:!0,xs:!0,children:Object(C.jsxs)(j.a,{m:2,children:[null===(null===I||void 0===I?void 0:I.unlockDate),(null===(null===I||void 0===I?void 0:I.unlockDate)||(null===I||void 0===I?void 0:I.unlockMilliseconds)<=0)&&(null===I||void 0===I?void 0:I.currentlyStaked)>0&&Object(C.jsxs)("form",{children:[Object(C.jsx)(W.a,{render:function(e){var t=e.field;return Object(C.jsx)(T.a,{autoFocus:!0,margin:"dense",label:"Withdraw Amount",type:"number",fullWidth:!0,value:t.value,onChange:function(e){return t.onChange(e.target.value)},variant:"filled",helperText:"Click on staked amount to set to max",className:"withdraw"})},control:v,name:"WithdrawAmount",defaultValue:""}),Object(C.jsx)(m.a,{onClick:J,variant:"contained",color:"primary",children:b?Object(C.jsx)(C.Fragment,{children:Object(C.jsx)(P.a,{color:"secondary",size:20})}):"Withdraw"})]}),0===(null===I||void 0===I?void 0:I.currentlyStaked)&&Object(C.jsxs)("div",{className:"lockedHiFiWrapper",children:[Object(C.jsx)("div",{className:"lockedHiFiBlocker",children:Object(C.jsx)("div",{className:"lockedTitle",children:"Can't withdraw - You have no $HiFi Staked into this option"})}),Object(C.jsx)(T.a,{margin:"dense",label:"Withdraw Amount",fullWidth:!0,value:0,InputProps:{readOnly:!0}}),Object(C.jsx)(m.a,{variant:"contained",color:"primary",children:b?Object(C.jsx)(C.Fragment,{children:Object(C.jsx)(P.a,{color:"secondary",size:20})}):"Withdraw"})]}),(null===I||void 0===I?void 0:I.unlockMilliseconds)>=0&&Object(C.jsxs)("div",{className:"lockedHiFiWrapper",children:[Object(C.jsxs)("div",{className:"lockedHiFiBlocker",children:[Object(C.jsx)("div",{className:"lockedTitle",children:"$HiFi Locked, unlocks"}),Object(C.jsx)("div",{className:"lockedUntil",children:x()(I.unlockDate).format("Do MMMM YYYY hh:mm:ss")})]}),Object(C.jsx)(T.a,{margin:"dense",label:"Withdraw Amount",fullWidth:!0,value:0,InputProps:{readOnly:!0}}),Object(C.jsx)(m.a,{variant:"contained",color:"primary",children:b?Object(C.jsx)(C.Fragment,{children:Object(C.jsx)(P.a,{color:"secondary",size:20})}):"Withdraw"})]})]})}),E&&(null===I||void 0===I?void 0:I.currentlyStaked)>0&&Object(C.jsx)(p.a,{item:!0,lg:12,md:12,sm:12,xs:12,children:Object(C.jsx)("div",{className:"stakingOptionVestingWarning",children:Object(C.jsxs)(C.Fragment,{children:["By staking more $HiFi into this option, you will reset the unlock date for all the $HiFi in this pool.",Object(C.jsx)("br",{}),Object(C.jsx)("br",{}),"The vesting period is : ",null===I||void 0===I?void 0:I.vestingPeriod]})})})]})]}),Object(C.jsx)(N.a,{children:Object(C.jsx)(m.a,{onClick:F,color:"primary",children:"Close"})})]})},H=function(e){var t=e.expiryDateProp,n=e.callBackFunc,i=Object(s.useState)("Loading.."),l=Object(r.a)(i,2),o=l[0],d=l[1];return Object(s.useEffect)((function(){!function(e){var t=setInterval(Object(c.a)(Object(a.a)().mark((function c(){var r,s,i,l,o,u;return Object(a.a)().wrap((function(a){for(;;)switch(a.prev=a.next){case 0:r=(new Date).getTime(),s=e-r,i=Math.floor(s/864e5),(l=Math.floor(s%864e5/36e5))<10&&(l="0".concat(l)),(o=Math.floor(s%36e5/6e4))<10&&(o="0".concat(o)),(u=Math.floor(s%6e4/1e3))<10&&(u="0".concat(u)),d("".concat(i,"d : ").concat(l,"h : ").concat(o,"m : ").concat(u,"s ")),s<0&&(clearInterval(t),n&&n([!1,!1,!1]));case 11:case"end":return a.stop()}}),c)}))),1e3)}(t)}),[t,n]),Object(C.jsx)(C.Fragment,{children:o})};t.default=function(e){var t=e.wipeSignatureAndReRequest,n=Object(v.i)(),b=n.id,h=n.collection,g=Object(l.c)(),N=g.chainId,w=g.account,y=Object(s.useState)(null),S=Object(r.a)(y,2),F=S[0],W=S[1],T=Object(s.useState)(null),P=Object(r.a)(T,2),D=P[0],A=P[1],U=Object(s.useState)(null),V=Object(r.a)(U,2),Y=V[0],R=V[1],q=Object(s.useState)(null),$=Object(r.a)(q,2),z=$[0],E=$[1],X=Object(s.useState)(null),J=Object(r.a)(X,2),G=J[0],_=J[1],K=Object(s.useState)(!1),Q=Object(r.a)(K,2),Z=Q[0],ee=Q[1],te=Object(s.useState)(!1),ne=Object(r.a)(te,2),ae=ne[0],ce=ne[1],re=function(){var e=Object(c.a)(Object(a.a)().mark((function e(){return Object(a.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:ee(!1);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),se=function(){var e=Object(c.a)(Object(a.a)().mark((function e(){return Object(a.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:ee(!0);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),ie=function(){var e=Object(c.a)(Object(a.a)().mark((function e(){return Object(a.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:ce(!1);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),le=function(){var e=Object(c.a)(Object(a.a)().mark((function e(t){return Object(a.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:R(t),ce(!0);case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();Object(s.useEffect)((function(){function e(){return(e=Object(c.a)(Object(a.a)().mark((function e(){var n,c,r,s,i,l,o,d,u,j,m,x;return Object(a.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(M.a)();case 2:if(e.sent){e.next=7;break}f.b.error("Unsupported network"),e.next=48;break;case 7:return n="NFT/".concat(h,"/").concat(b),e.next=10,Object(k.a)(n,"GET",t,w,null,!0,null);case 10:return c=e.sent,e.next=13,Object(M.m)();case 13:if(r=e.sent,!w){e.next=40;break}return s=Object(M.n)(),e.next=18,s.methods.getUserPoolsForNFT(w,L.d,Number(b)).call();case 18:return i=e.sent,e.next=21,s.methods.getStakingOptionLength().call();case 21:l=e.sent,o=[],d=0;case 24:if(!(d<Number(l))){e.next=32;break}return e.next=27,s.methods.stakingOptions(d).call();case 27:u=e.sent,o.push(u);case 29:d++,e.next=24;break;case 32:j=Object(a.a)().mark((function e(){var t,n,r,l,d,u;return Object(a.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=Number(i[m]),e.next=3,s.methods.getUserPoolInfo(Number(t)).call();case 3:return n=e.sent,e.next=6,s.methods.pools(Number(t)-1).call();case 6:r=e.sent,null!=(l=c.stakingOptions.find((function(e){return e.index===Number(r.stakingOption)})))&&(l.currentlyStaked=Object(M.v)(n.amount),d=o[l.index],0!==Number(d.duration)&&((u=new Date(1e3*Number(n.vestingStart))).setSeconds(u.getSeconds()+Number(d.duration)),l.unlockDate=u,l.unlockMilliseconds=u-new Date));case 9:case"end":return e.stop()}}),e)})),m=0;case 34:if(!(m<i.length)){e.next=39;break}return e.delegateYield(j(),"t0",36);case 36:m++,e.next=34;break;case 39:null!==(null===c||void 0===c?void 0:c.levelInfo.hoursUntilNextLevel)&&((x=new Date).setSeconds(x.getSeconds()+3600*(null===c||void 0===c?void 0:c.levelInfo.hoursUntilNextLevel)),c.levelInfo.dateOfNextLevel=x);case 40:return W(c),A(c.stakingOptions),E(r),e.t1=_,e.next=46,Object(M.q)();case 46:e.t2=e.sent,(0,e.t1)(e.t2);case 48:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[w,N,h,b,t]);var oe=function(e){return Object(C.jsxs)(j.a,{className:"stakingOption",children:[Object(C.jsx)("div",{className:"optionTitle",children:e.vestingPeriod}),Object(C.jsxs)(p.a,{container:!0,item:!0,lg:12,md:12,sm:12,xs:12,className:"detailsWrapper",children:[Object(C.jsx)(p.a,{item:!0,lg:3,md:3,sm:6,xs:6,children:Object(C.jsxs)(p.a,{container:!0,item:!0,lg:12,md:12,sm:12,xs:12,children:[Object(C.jsxs)(p.a,{item:!0,lg:12,md:12,sm:12,xs:12,className:"detailHeader",children:["Currently Staked",Object(C.jsx)("hr",{})]}),Object(C.jsx)(p.a,{item:!0,lg:12,md:12,sm:12,xs:12,className:"detailValue",children:Number(e.currentlyStaked).toLocaleString()})]})}),Object(C.jsx)(p.a,{item:!0,lg:2,md:2,sm:6,xs:6,children:Object(C.jsxs)(p.a,{container:!0,item:!0,lg:12,md:12,sm:12,xs:12,children:[Object(C.jsxs)(p.a,{item:!0,lg:12,md:12,sm:12,xs:12,className:"detailHeader",children:["XP Bonus",Object(C.jsx)("hr",{})]}),Object(C.jsx)(p.a,{item:!0,lg:12,md:12,sm:12,xs:12,className:"detailValue",children:e.bonus})]})}),Object(C.jsx)(p.a,{item:!0,lg:4,md:4,sm:6,xs:6,children:Object(C.jsxs)(p.a,{container:!0,item:!0,lg:12,md:12,sm:12,xs:12,children:[Object(C.jsxs)(p.a,{item:!0,lg:12,md:12,sm:12,xs:12,className:"detailHeader",children:["Locked Until",Object(C.jsx)("hr",{})]}),Object(C.jsxs)(p.a,{item:!0,lg:12,md:12,sm:12,xs:12,className:"detailValue",children:[Number(e.currentlyStaked)>0&&null!=e.unlockDate&&Object(C.jsx)(C.Fragment,{children:x()(e.unlockDate).format("Do MMMM YYYY hh:mm:ss")}),e.currentlyStaked<=0||null===e.unlockDate&&Object(C.jsx)(C.Fragment,{children:"N/A"})]})]})}),Object(C.jsx)(p.a,{item:!0,lg:3,md:3,sm:6,xs:6,children:Object(C.jsx)(m.a,{onClick:function(){return le(e)},className:"stakeButton",children:"Deposit / Withdraw"})})]})]},Object(i.a)())},de=function(){var e;return Object(C.jsx)(u.a,{className:"propertiesWrapper",children:(null===F||void 0===F||null===(e=F.properties)||void 0===e?void 0:e.length)>0&&(null===F||void 0===F?void 0:F.properties.map((function(e){return Object(C.jsxs)(p.a,{container:!0,className:"prop",children:[Object(C.jsx)(p.a,{item:!0,lg:4,md:4,sm:6,xs:6,className:"propSlot",children:e.slot}),Object(C.jsxs)(p.a,{item:!0,lg:8,md:8,sm:6,xs:6,className:"propValue",children:[e.value," "]})]},Object(i.a)())})))})},ue=function(){var e,t;return Object(C.jsx)(d.a,{className:"headerCard",children:Object(C.jsx)(u.a,{children:Object(C.jsxs)(p.a,{container:!0,children:[Object(C.jsx)(p.a,{item:!0,lg:3,md:3,sm:12,xs:12,children:Object(C.jsx)("img",{src:null!==(e="".concat("http://localhost:29926","/").concat(null===F||void 0===F?void 0:F.image))&&void 0!==e?e:"".concat("http://localhost:29926","/").concat(null===F||void 0===F?void 0:F.image),alt:"nftImg",className:"nftImg",style:{width:"100%"}})}),Object(C.jsxs)(p.a,{item:!0,lg:8,md:8,sm:12,xs:12,className:"nftInfoWrapper",children:[Object(C.jsx)("div",{className:"name",children:null===F||void 0===F?void 0:F.name}),Object(C.jsxs)("div",{className:"info tier",children:["Tier: ",null===F||void 0===F?void 0:F.tierReadable]}),(null===F||void 0===F?void 0:F.levelInfo)&&Object(C.jsxs)("div",{className:"info",children:["Total HiFi Staked:"," ",Object(C.jsx)("span",{children:null===F||void 0===F?void 0:F.levelInfo.tokensStaked.toLocaleString()})]}),null!==(null===F||void 0===F?void 0:F.levelInfo.hoursUntilNextLevel)&&Object(C.jsxs)("div",{className:"info",children:["Time until next level:"," ",Object(C.jsx)("span",{children:Object(C.jsx)(H,{expiryDateProp:null===F||void 0===F?void 0:F.levelInfo.dateOfNextLevel})})]}),(null===F||void 0===F||null===(t=F.info)||void 0===t?void 0:t.length)>0&&Object(C.jsx)(p.a,{container:!0,className:"infoBoxes",children:F.info.map((function(e){return Object(C.jsxs)(p.a,{item:!0,lg:6,md:6,sm:12,xs:12,className:"infoBox info",children:[Object(C.jsxs)("div",{className:"header",children:[e.title,0===e.type&&Object(C.jsx)("div",{className:"levelTrack",children:Object(C.jsx)(O.a,{onClick:se})})]}),Object(C.jsx)("div",{className:"info",children:null===e||void 0===e?void 0:e.value}),e.additionalInfo&&Object(C.jsx)("div",{className:"info",children:e.additionalInfo})]},Object(i.a)())}))})]})]})})})};return Object(C.jsxs)(C.Fragment,{children:[Object(C.jsxs)(o.BrowserView,{className:"nftView",children:[Object(C.jsx)(ue,{}),Object(C.jsxs)(p.a,{container:!0,direction:"row",spacing:2,children:[Object(C.jsx)(p.a,{item:!0,lg:4,md:4,sm:12,xs:12,children:Object(C.jsx)(p.a,{container:!0,children:Object(C.jsxs)(d.a,{className:"propertiesCard",children:["Properties",Object(C.jsx)(de,{})]})})}),Object(C.jsx)(p.a,{item:!0,lg:8,md:8,sm:12,xs:12,children:Object(C.jsx)(p.a,{container:!0,children:Object(C.jsxs)(d.a,{className:"stakingCard",children:["Staking",Object(C.jsx)("div",{className:"optionsWrapper",children:(null===D||void 0===D?void 0:D.length)>0&&D.map((function(e){return oe(e)}))})]})})})]})]}),Object(C.jsxs)(o.MobileView,{className:"nftView mobile",children:[Object(C.jsx)(ue,{}),Object(C.jsxs)(p.a,{container:!0,direction:"row",spacing:2,children:[Object(C.jsx)(p.a,{item:!0,lg:4,md:4,sm:12,xs:12,children:Object(C.jsx)(p.a,{container:!0,children:Object(C.jsxs)(d.a,{className:"propertiesCard",children:["Properties",Object(C.jsx)(de,{})]})})}),Object(C.jsx)(p.a,{item:!0,lg:8,md:8,sm:12,xs:12,children:Object(C.jsx)(p.a,{container:!0,children:Object(C.jsxs)(d.a,{className:"stakingCard",children:["Staking",Object(C.jsx)("div",{className:"optionsWrapper",children:(null===D||void 0===D?void 0:D.length)>0&&D.map((function(e){return oe(e)}))})]})})})]})]}),Object(C.jsx)(B,{open:ae,handleClose:ie,stakingOption:Y,minDepositAmount:z,nftIndex:b,tokenBalance:G}),(null===F||void 0===F?void 0:F.levelTrack)&&Object(C.jsx)(I,{open:Z,handleClose:re,levelTrack:F.levelTrack,currentLevel:F.levelInfo.currentLevel})]})}}}]);
//# sourceMappingURL=31.6bcfd358.chunk.js.map