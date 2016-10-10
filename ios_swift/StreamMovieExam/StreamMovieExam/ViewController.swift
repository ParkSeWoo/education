//
//  ViewController.swift
//  StreamMovieExam
//
//  Created by plurry on 2016. 9. 11..
//  Copyright © 2016년 plurry. All rights reserved.
//

import UIKit
import MediaPlayer
import AVKit

class ViewController: UIViewController {
    
    var moviePlayer : MPMoviePlayerController!

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        let url :NSURL? = NSURL(string:"http://jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v")
        moviePlayer = MPMoviePlayerController(contentURL: url)
        moviePlayer.view.frame = CGRect(x:20, y:100, width: 200, height:150)
        self.view.addSubview(moviePlayer.view);
        moviePlayer.fullscreen = true
        moviePlayer.controlStyle = MPMovieControlStyle.Embedded
        moviePlayer.play()
        
        /*if let url = NSURL(string: "http://devstreaming.apple.com/videos/wwdc/2016/102w0bsn0ge83qfv7za/102/hls_vod_mvp.m3u8"){
            
            let player = AVPlayer(URL: url)
            let controller=AVPlayerViewController()
            controller.player=player
            controller.view.frame = self.view.frame
            self.view.addSubview(controller.view)
            self.addChildViewController(controller)
            player.play()
        }*/
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

