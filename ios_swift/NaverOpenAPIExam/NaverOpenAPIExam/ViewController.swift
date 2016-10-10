//
//  ViewController.swift
//  NaverOpenAPIExam
//
//  Created by plurry on 2016. 9. 25..
//  Copyright © 2016년 plurry. All rights reserved.
//

import UIKit

class ViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, XMLParserDelegate {
    @IBOutlet var queryText: UITextField!
    @IBOutlet var movieList: UITableView!
    
    //ClientID
    //FLu8zC9pAML9JtAj21YE
    //ClientSecret
    //bhYphxsabn
    
    //https://openapi.naver.com/v1/search/movie.xml?query=MOVIETITLE

    //검색 버튼 클릭
    @IBAction func onSearch(_ sender: AnyObject) {
        
        if (queryText.text == "") {
            return
        }
        
        let urlString = "https://openapi.naver.com/v1/search/movie.xml?query="+queryText.text!
        //URL Encoding 반드시 해주어야 함
        let urlwithPercentEscapes = urlString.addingPercentEncoding( withAllowedCharacters: NSCharacterSet.urlQueryAllowed)
        let url = URL(string: urlwithPercentEscapes!)
        
        var request = URLRequest(url: url!)
        request.addValue("application/xml; charset=utf-8", forHTTPHeaderField: "Content-Type")
        //Naver에서만 넣어주어야 하는 헤더정보
        request.addValue("FLu8zC9pAML9JtAj21YE", forHTTPHeaderField: "X-Naver-Client-Id")
        request.addValue("bhYphxsabn", forHTTPHeaderField: "X-Naver-Client-Secret")
        
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
            
            self.item?.title = ""
            self.item?.director = ""
            self.item?.image = ""
            self.item?.actor = ""
            self.item?.link = ""
            self.item?.pubDate = 0
            self.item?.subtitle = ""
            self.item?.userRating = 0.0

            // Parse the XML
            let parser = XMLParser(data: Data(data))
            parser.delegate = self
            let success:Bool = parser.parse()
            if success {
                print("parse success!")
                print(self.strXMLData)
             //   lblNameData.text=strXMLData
            } else {
                print("parse failure!")
            }
            //let json = try! JSONSerialization.jsonObject(with: data, options: [])
            //print(json)
        }
        
        task.resume()
    }
    
    //XML delegate
    var currentElement : String? = ""
    var strXMLData : String? = ""
    var item : MovieItem? = nil
    
    func parser(_ parser: XMLParser, didStartElement elementName: String, namespaceURI: String?, qualifiedName qName: String?, attributes attributeDict: [String : String] = [:]) {
        currentElement=elementName;
        if (elementName == "item") {
            item = MovieItem()
            item?.title = ""
            item?.director = ""
            item?.image = ""
            item?.actor = ""
            item?.link = ""
            item?.pubDate = 0
            item?.subtitle = ""
            item?.userRating = 0.0
        }
    }
    
    func parser(_ parser: XMLParser, didEndElement elementName: String, namespaceURI: String?, qualifiedName qName: String?) {
        currentElement="";
        if (elementName == "item") {
            list.append(self.item!)
            movieList.reloadData()
        }
    }
    
    func parser(_ parser: XMLParser, foundCharacters string: String) {
        if (item != nil) {
            if (currentElement == "title") {
                item!.title! = item!.title! + string
            } else if (currentElement == "director") {
                self.item!.director! = self.item!.director! + string
            } else if (currentElement == "actor") {
                self.item!.actor! = self.item!.actor! + string
            }
        }
    }

    func parser(_ parser: XMLParser, parseErrorOccurred parseError: Error) {
        //NSLog("failure error: %@", parseError)
    }
    
    var list = Array<MovieItem>();
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.list.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ListCell") as UITableViewCell!
        
        let title = cell!.viewWithTag(101) as? UILabel
        let director = cell!.viewWithTag(102) as? UILabel
        let actor = cell!.viewWithTag(103) as? UILabel
        
        let row = self.list[indexPath.row];
        
        do {
            
            let data = ("<H3><font color='red'>"+row.title!+"</font></H3>").data(using: String.Encoding.utf8)
            let htmlAttrString = try NSAttributedString(data: data!, options:[NSDocumentTypeDocumentAttribute:NSHTMLTextDocumentType, NSCharacterEncodingDocumentAttribute: String.Encoding.utf8.rawValue], documentAttributes: nil)
            title?.attributedText = htmlAttrString
        } catch {
            print("An error occured")
            title?.text = row.title!
        }
        director?.text = row.director!
        actor?.text = row.actor!
        
        return cell!
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        NSLog("select %d", indexPath.row)
    }
    

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.

    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

