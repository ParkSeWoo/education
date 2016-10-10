//
//  ViewController.swift
//  DaumOpenAPIExam
//
//  Created by plurry on 2016. 10. 2..
//  Copyright © 2016년 plurry. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
         let urlString = "https://apis.daum.net/search/image?apikey=85ac72bf4d97eef7a3de4fafb5407f5c&q=다음카카오&output=json"
        //URL Encoding 반드시 해주어야 함
        let urlwithPercentEscapes = urlString.addingPercentEncoding( withAllowedCharacters: NSCharacterSet.urlQueryAllowed)
        let url = URL(string: urlwithPercentEscapes!)
        
        var request = URLRequest(url: url!)
        request.addValue("application/json; charset=utf-8", forHTTPHeaderField: "Content-Type")
        
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            guard error == nil else {
                print(error)
                return
            }
            guard let data = data else {
                print("Data is empty")
                return
            }
            
            //수신한 데이터 출력
            print(String(data: data, encoding: String.Encoding.utf8))
            
            let json = try! JSONSerialization.jsonObject(with: data, options: []) as! NSDictionary
            let channel : NSDictionary = (json["channel"] as! NSDictionary)//첫번째 Key:Value인 channel 추출
            let items : NSArray = (channel["item"] as! NSArray)//channel의 하위 Key인 item을 배열로 추출
            print(items.count)
            for item in items {
                let item1 = item as! NSDictionary
                print(item1["title"] as! String)
                print(item1["image"] as! String)
            }
            //print(json)
        }
        
        task.resume()
        
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

