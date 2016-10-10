//
//  ViewController.swift
//  TableViewExam
//
//  Created by plurry on 2016. 9. 24..
//  Copyright © 2016년 plurry. All rights reserved.
//

import UIKit

class ViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    @IBOutlet var tableView1: UITableView!
   
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    var list = Array<TestData>();
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        var data = TestData();
        data.title = "홍길동"
        data.description = "착한 사람입니다."
        data.value = 95.0
        data.filename = "pic01.jpeg"
        self.list.append(data)
        
        data = TestData();
        data.title = "나천재"
        data.description = "사기꾼입니다."
        data.value = 25.6
        data.filename = "pic02.jpeg"
        self.list.append(data)
    }
    //테이블뷰가 출력할 데이터의 개수 전달
    func tableView(_ tableView:UITableView, numberOfRowsInSection section:Int) -> Int {
        return self.list.count
    }
    //화면에 출력되어야 하는 테이블뷰 셀 객체 전달
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let row = self.list[indexPath.row];
        let cell = tableView.dequeueReusableCell(withIdentifier: "ListCell") as UITableViewCell!
        //cell!.textLabel?.text = row.title
        let title = cell!.viewWithTag(101) as? UILabel
        let description = cell!.viewWithTag(102) as? UILabel
        let pic = cell!.viewWithTag(201) as? UIImageView
        
        title?.text = row.title!+"\(row.value!)"
        description?.text = row.description!
        pic?.image = UIImage(named: row.filename!)
        
        return cell!
    }
    //테이블에서 특정 항목을 클릭했을 때 호출
    func tableView(_ tableView:UITableView, didSelectRowAt indexPath:IndexPath) {
        NSLog("Touch Table Row at %d", indexPath.row);
    }

}

