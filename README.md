# cea608-extractor

The goal of this project is to provide CEA-608 caption support to web browsers for use
with fragmented MP4 playback within an MSE HTML5 source buffer. This project should deal
with the parsing and display of this data within the browser. A node utility may be provided
for debugging, utility, and testing purposes. A web worker will be provided in order to perform
the work in a separate thread if possible. The API should be minimal and work with ArrayBuffer
objects which would get appended to an MSE source buffer.

CEA-608 caption data is still widely used in the cable industry, there doesn't seem to be many
plans for providing native support for this format in the browser. This tool will hope to provide
functionality in regards to parsing and displaying this data for a video element in the browser.
The most simplest form of this will be conversion of the CEA-608 data to VTT format for use with
a text track. In situations where styling information is required to be displayed the HTML and
CSS will be provided to render this data on the DOM.

## Node utility tool

```
node bin/index.js input.mp4

[00:00:59 -> 00:01:01]             (BEEPING)           
[00:01:02 -> 00:01:03]          (COIN DROPPING)        
[00:01:05 -> 00:01:07]         My name's Ralph,        
[00:01:05 -> 00:01:07]         and I'm a bad guy.      
[00:01:10 -> 00:01:15]  Let's see. I'm nine feet tall. 
[00:01:10 -> 00:01:15]  I weigh 643 pounds.            
[00:01:15 -> 00:01:16]         Got a little bit        
[00:01:15 -> 00:01:16]         of a temper on me.      
[00:01:16 -> 00:01:18]     Hey, you moved my stump!    
[00:01:18 -> 00:01:20]         (GROWLING)              
[00:01:20 -> 00:01:22]      RALPH: My passion bubbles  
[00:01:20 -> 00:01:22]      very near the surface,     
[00:01:22 -> 00:01:24]      I guess, not gonna lie.    
[00:01:26 -> 00:01:27]       Anyhoo, what else? Uh...  
[00:01:29 -> 00:01:32]  I'm a wrecker. I wreck things. 
[00:01:29 -> 00:01:32]  Professionally.                
[00:01:32 -> 00:01:34]   I'm going to wreck it!        
[00:01:34 -> 00:01:36]     I'm very good at what I do. 
[00:01:34 -> 00:01:36]     Probably the best I know.   
[00:01:36 -> 00:01:38]                 (YELLING)       
[00:01:38 -> 00:01:41]      The thing is, fixing       
[00:01:38 -> 00:01:41]      is the name of the game.   
[00:01:41 -> 00:01:43]          Literally,             
[00:01:41 -> 00:01:43]          Fix-It Felix, Jr.      
[00:01:43 -> 00:01:45]           NICELANDERS:          
[00:01:43 -> 00:01:45]           Fix it, Felix!
```

