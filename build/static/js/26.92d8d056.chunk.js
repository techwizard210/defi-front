(this["webpackJsonpHiFi-DeFi"]=this["webpackJsonpHiFi-DeFi"]||[]).push([[26],{1170:function(e,a,t){"use strict";t.r(a);var c=t(2),n=t(15),s=t(24),i=t(0),r=t(126),l=t(838),o=t(645),m=t(14),j=t(65),b=t(1162),d=t(1152),u=t(1105),O=t(846),x=t(847),h=t(848),p=t(644),g=t(442),f=t(712),v=t(632),N=t(1150),w=t(1151),G=t(1153),C=t(51),y=t(590),k=t(217),I=t(90),B=t.p+"static/media/newGameBanner.180a4dd4.png",A=t.p+"static/media/APRBanner.b04f2d81.png",S=t(1);a.default=function(e){var a=I.a.browseGame(),t=I.a.backdrop(),H=e.wipeSignatureAndReRequest,E=Object(j.c)(),T=E.account,M=E.chainId,W=Object(i.useState)([]),R=Object(s.a)(W,2),F=R[0],L=R[1],P=Object(i.useState)(8),z=Object(s.a)(P,2),D=z[0],J=z[1],V=Object(i.useState)(!1),Z=Object(s.a)(V,2),q=Z[0],U=Z[1];u.a.use([O.a,x.a,h.a]);var K=function(){U(!1)},Q=function(e){var a,t=null!==(a=e.id)&&void 0!==a?a:e.bundleUrl;C.a.push("/play-game/".concat(t))},X=function(e){C.a.push("/".concat(e))};Object(i.useEffect)((function(){var e=function(){var e=Object(n.a)(Object(c.a)().mark((function e(){var a;return Object(c.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Object(k.a)("GameManagement?mobile=".concat(r.isMobile),"GET",H,T,null,!0,null);case 3:a=e.sent,L(a),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),console.log("failed to fetch games");case 11:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(){return e.apply(this,arguments)}}();e()}),[T,M,H]),Object(i.useEffect)((function(){window.addEventListener("resize",(function(){var e=window.innerWidth;e>=1300?J(8):e<1300&&e>=1e3?J(6):e<1e3&&e>=800?J(4):e<800&&e>=700&&J(2)}))}),[T]);var Y=function(e){if("left"===e)for(var a=0;a<document.getElementsByClassName("swiper-button-prev").length;a+=1)document.getElementsByClassName("swiper-button-prev")[a].click();else for(var t=0;t<document.getElementsByClassName("swiper-button-next").length;t+=1)document.getElementsByClassName("swiper-button-next")[t].click()},$=function(){return Object(S.jsxs)(g.a,{container:!0,spacing:2,children:[Object(S.jsxs)(g.a,{container:!0,item:!0,xs:12,spacing:2,children:[Object(S.jsx)(g.a,{item:!0,lg:4,md:6,xs:12,children:Object(S.jsx)(g.a,{className:Object(m.default)(a.gameCarouselOption,"recommendCarouselAnimation"),children:Object(S.jsxs)(g.a,{className:a.swiperContent,children:[Object(S.jsx)("h2",{className:a.recommendGames,children:"Recommended Games"}),Object(S.jsxs)(g.a,{className:a.featuredSlider,children:[Object(S.jsx)(N.a,{onClick:function(){return Y("left")},className:Object(m.default)(a.prevButton,"prevButton")}),Object(S.jsx)(w.a,{onClick:function(){return Y("right")},className:Object(m.default)(a.nextButton,"nextButton")}),Object(S.jsx)(b.a,{navigation:!0,className:Object(m.default)(a.mySwiper,"mySwiper"),mousewheel:!1,preventInteractionOnTransition:!0,loop:!0,autoplay:{delay:5e3,disableOnInteraction:!1},children:F.slice(0,5).map((function(e){return Object(S.jsx)(d.a,{children:Object(S.jsx)(y.a,{item:e,ActiveGame:Q})},Object(o.a)())}))})]}),Object(S.jsx)(g.a,{className:a.featSwiperBg,children:Object(S.jsx)(b.a,{navigation:!0,loop:!0,autoplay:{delay:5e3,disableOnInteraction:!1},children:F.slice(0,8).map((function(e){return Object(S.jsxs)(d.a,{children:[Object(S.jsx)(g.a,{className:a.gameOverlay,children:Object(S.jsx)(G.a,{className:a.gameOverlayIcon})}),Object(S.jsx)("img",{src:"".concat("http://localhost:29926","/").concat(e.img),alt:e.title,className:Object(m.default)(a.gameImage,a.recommendImage,a.backImage)})]},Object(o.a)())}))})})]})})}),Object(S.jsx)(g.a,{item:!0,lg:8,md:6,xs:12,children:Object(S.jsx)(g.a,{container:!0,spacing:!0===r.isMobile?0:2,children:F.slice(0,D).map((function(e){return Object(S.jsx)(g.a,{item:!0,lg:3,sm:6,xs:12,className:a.perGameContainer,children:Object(S.jsx)(y.a,{item:e,ActiveGame:Q})},Object(o.a)())}))})})]}),Object(S.jsx)(g.a,{container:!0,item:!0,xs:12,spacing:2,className:a.marginZero,children:F.slice(8).map((function(e){return Object(S.jsx)(g.a,{item:!0,lg:2,sm:3,xs:!0===r.isMobile?6:12,className:a.perGameContainer,children:Object(S.jsx)(y.a,{item:e,ActiveGame:Q})},Object(o.a)())}))})]})},_=function(){return Object(S.jsxs)(g.a,{container:!0,item:!0,xs:12,spacing:2,className:a.marginZero,children:[F&&F.map((function(e){return Object(S.jsx)(g.a,{item:!0,lg:2,sm:3,xs:!0===r.isMobile?6:12,className:a.perGameContainer,children:Object(S.jsx)(y.a,{item:e,ActiveGame:Q})},Object(o.a)())})),!F||0===F.length&&Object(S.jsx)(g.a,{item:!0,lg:2,sm:3,xs:!0===r.isMobile?6:12,className:a.perGameContainer,children:"No games found..."},Object(o.a)())]})};return Object(S.jsxs)(S.Fragment,{children:[Object(S.jsxs)(r.BrowserView,{children:[Object(S.jsxs)(p.a,{children:[Object(S.jsx)(g.a,{container:!0,className:a.gameHeaderSection,children:Object(S.jsx)(g.a,{container:!0,item:!0,lg:12,xs:12,children:Object(S.jsxs)(l.Carousel,{showThumbs:!1,showArrows:!1,stopOnHover:!1,interval:8e3,infiniteLoop:!0,emulateTouch:!0,autoPlay:!0,className:"customCarouselRoot",children:[Object(S.jsxs)("div",{className:"newGamesBanner",children:[Object(S.jsx)("img",{alt:"img1",src:B,className:"carouselImage"}),Object(S.jsx)("div",{className:"newGamesWrapper",children:Object(S.jsxs)(g.a,{container:!0,children:[Object(S.jsx)(g.a,{item:!0,lg:3,md:3,xs:3}),Object(S.jsx)(g.a,{item:!0,lg:9,md:9,xs:9,children:Object(S.jsxs)(g.a,{container:!0,spacing:3,children:[Object(S.jsx)(g.a,{item:!0,lg:2,sm:2,xs:2,className:"bannerGameWrapper"},Object(o.a)()),F.slice(0,3).map((function(e){return Object(S.jsx)(g.a,{item:!0,lg:3,md:3,sm:3,xs:3,className:"bannerGameWrapper",children:Object(S.jsx)(y.a,{item:e,ActiveGame:Q})},Object(o.a)())}))]})})]})})]}),Object(S.jsx)("div",{role:"button",tabIndex:"0",onClick:function(){return X("stake-rewards")},children:Object(S.jsx)("img",{alt:"aprBanner",src:A,className:"carouselImage"})})]})})}),Object(S.jsx)(g.a,{container:!0,className:a.mGameHeaderSection,children:Object(S.jsx)("div",{className:a.pageAlert,role:"button",tabIndex:"0",onClick:function(){return X("dashboard")},children:"The new earnings model is now live! Head over to the profile page to view your active missions!"})}),Object(S.jsx)(g.a,{container:!0,className:a.gameListSection,children:Object(S.jsx)($,{})})]}),Object(S.jsx)(f.a,{className:t.backdrop,open:q,onClick:K,style:{zIndex:999999},children:Object(S.jsx)(v.a,{color:"inherit"})})]}),Object(S.jsxs)(r.MobileView,{children:[Object(S.jsxs)(p.a,{children:[Object(S.jsx)(g.a,{container:!0,className:a.mGameHeaderSection,children:Object(S.jsx)(g.a,{container:!0,item:!0,lg:6,xs:12,children:Object(S.jsxs)(l.Carousel,{showThumbs:!1,showArrows:!1,stopOnHover:!1,interval:8e3,infiniteLoop:!0,emulateTouch:!0,autoPlay:!0,className:"mCustomCarouselRoot",children:[Object(S.jsxs)("div",{className:"newGamesBanner",children:[Object(S.jsx)("img",{alt:"img1",src:B,className:"carouselImage"}),Object(S.jsx)("div",{className:"newGamesWrapper",children:Object(S.jsxs)(g.a,{container:!0,children:[Object(S.jsx)(g.a,{item:!0,lg:3,md:3,xs:3}),Object(S.jsx)(g.a,{item:!0,lg:9,md:9,xs:9,children:Object(S.jsxs)(g.a,{container:!0,spacing:3,children:[Object(S.jsx)(g.a,{item:!0,lg:2,sm:2,xs:2,className:"bannerGameWrapper"},Object(o.a)()),F.slice(0,3).map((function(e){return Object(S.jsx)(g.a,{item:!0,lg:3,md:3,sm:3,xs:3,className:"bannerGameWrapper",onClick:function(){return Q(e)},children:Object(S.jsx)("img",{src:"".concat("http://localhost:29926","/").concat(e.img),alt:"newGames",onClick:function(){return Q(e)}})},Object(o.a)())}))]})})]})})]}),Object(S.jsx)("div",{role:"button",tabIndex:"0",onClick:function(){return X("stake-rewards")},children:Object(S.jsx)("img",{alt:"aprBanner",src:A,className:"carouselImage"})})]})})}),Object(S.jsx)(g.a,{container:!0,className:a.mGameHeaderSection,justifyContent:"center",alignItems:"center",children:Object(S.jsx)("div",{className:a.pageAlert,role:"button",tabIndex:"0",onClick:function(){return X("dashboard")},children:"The new earnings model is now live! Head over to the profile page to view your active missions!"})}),Object(S.jsx)(g.a,{container:!0,className:a.mGameHeaderSection,children:Object(S.jsx)(_,{})})]}),Object(S.jsx)(f.a,{className:t.backdrop,open:q,onClick:K,style:{zIndex:999999},children:Object(S.jsx)(v.a,{color:"inherit"})})]})]})}},590:function(e,a,t){"use strict";var c=t(442),n=t(592),s=t.n(n),i=t(591),r=t.n(i),l=t(593),o=t.n(l),m=t(1);a.a=function(e){var a=e.item,t=e.ActiveGame;return Object(m.jsx)(c.a,{className:"game-holder",children:Object(m.jsx)(c.a,{className:"game-image-wrapper",children:Object(m.jsxs)(c.a,{className:"game-image-holder",children:[Object(m.jsxs)(c.a,{className:"game-image-overlay",children:[(null===a||void 0===a?void 0:a.keyboard)&&Object(m.jsx)(r.a,{}),(null===a||void 0===a?void 0:a.joystick)&&Object(m.jsx)(s.a,{}),(null===a||void 0===a?void 0:a.mouse)&&Object(m.jsx)(o.a,{})]}),Object(m.jsx)(c.a,{className:"game-image-bg",style:{backgroundImage:"url(".concat("http://localhost:29926","/").concat(a.img,")")}}),Object(m.jsx)(c.a,{className:"game-action gameActionIcon",children:Object(m.jsx)("p",{className:"playBtn",onClick:function(){return t(a)},children:"Play the Game"})}),Object(m.jsx)(c.a,{className:"game-info",children:Object(m.jsx)("span",{className:"game-name",children:Object(m.jsx)("span",{children:a.title})})})]})})})}}}]);
//# sourceMappingURL=26.92d8d056.chunk.js.map