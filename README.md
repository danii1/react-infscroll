# react-infscroll

[![Build Status](https://travis-ci.org/alexcurtis/react-infscroll.svg?branch=master)](https://travis-ci.org/alexcurtis/react-infscroll) [![Coverage Status](https://coveralls.io/repos/alexcurtis/react-infscroll/badge.svg?branch=master&service=github)](https://coveralls.io/github/alexcurtis/react-infscroll?branch=master)

React Infinite Scroller Component

### Install

```
npm install react-infscroll --save
```

### Quick Start
```javascript
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

class InfScrollExample extends React.Component {
    constructor(props){
        super(props);
    }
    getNext(){ /* ... */ }
    render(){
        return (
            <InfiniteScroll
                loadingEl={<Loading/>}
                getNext={this.getNext}
                canGetNext={true}>
                    <Content/>
            </InfiniteScroll>
        );
    }
}

const content = document.getElementById('content');
ReactDOM.render(<InfScrollExample/>, content);
```
