## Introduction
Previews images according to the imgUrl and the img Element

## Install with npm:
```bash
npm install react-imagepreview
```

## Usage
```js
import React from 'react'
import ImagePreview from 'react-imagepreview'

function MyComponent() {
  return (
    <div>
      <img src={src} onClick={(e) => ImagePreview.show(src, e.target)}>
    </div>
  )
}
``` 

## Demo
```bash
cd demo
npm install
npm start
```