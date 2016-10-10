//
//  ViewController.swift
//  SQLiteExam
//
//  Created by plurry on 2016. 10. 1..
//  Copyright © 2016년 plurry. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        do {
            let s = SQLInterface()
            for i in 1...100 {
                try s.insert_value(value:Int32(i))
            }
            let result = try s.get_values()
            print(result)
        } catch let e {
            print("ooops", e)
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

