//
//  ViewController.swift
//  MapExam
//
//  Created by plurry on 2016. 9. 11..
//  Copyright © 2016년 plurry. All rights reserved.
//

import UIKit
import MapKit

class ViewController: UIViewController {
    
    
    @IBOutlet var map: MKMapView!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        let latitude = 37.4972511
        let longitude = 127.0295846
        let location = CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
        let regionRadius : CLLocationDistance = 1000
        let coordinateRegion = MKCoordinateRegionMakeWithDistance(location, regionRadius, regionRadius)
        self.map.setRegion(coordinateRegion, animated: true)
        
        let point = MKPointAnnotation();
        point.title = "아이디어 팩토리"
        point.coordinate = location
        self.map.addAnnotation(point)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

