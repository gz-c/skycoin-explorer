import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Block, Transaction } from '../block-chain-table/block';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'lodash';
import moment from 'moment-es6';
import { ApiService } from '../../../services/api/api.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-block-details',
  templateUrl: './block-details.component.html',
  styleUrls: ['./block-details.component.css']
})
export class BlockDetailsComponent implements OnInit {

  private blocksObservable: Observable<Block[]>;

  private block: Block;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.block=null;
  }

  ngOnInit() {
    this.blocksObservable= this.route.params
      .filter(params => params['id'] !== undefined)
      .switchMap((params: Params) => {
        let selectedBlock = +params['id'];
        return this.api.getBlocks(selectedBlock,selectedBlock);
      });

    this.blocksObservable.subscribe((blocks)=>{
      this.block = blocks[0];
    })

  }

  getTime(time:number){
    return moment.unix(time).format();
  }

  getAmount(block:Block){
    var ret = [];
    let txns: Transaction[] = block.body.txns;
    _.each(txns, function(o){
      if(o.outputs){
        _.each(o.outputs, function(_o){
          ret.push(_o.coins);
        })
      }

    })
    let totalCoins=ret.reduce(function(memo, coin) {
      return memo + parseInt(coin);
    }, 0);
    return totalCoins;
  }
}
