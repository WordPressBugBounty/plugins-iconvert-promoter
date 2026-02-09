<?php

namespace KPromo\Blocks;

use KPromo\Core\Blocks\BlockBase;
use KPromo\Core\Registry;

class CountDownSeparatorBlock extends BlockBase {

	const OUTER = 'outer';

	public function __construct( $block, $autoload = true ) {
		parent::__construct( $block, $autoload );
	}

	public function computed() {
		return array(
			'separatorShow' => $this->getAttribute( 'separatorShow' ),
		);
	}

	public function mapPropsToElements() {
		$itemName = $this->getAttribute( 'itemName' );
		$itemType = $this->getAttribute( 'itemType' );

		return array(
			self::OUTER => array(
				'data-itemname' => "{$itemName}",
				'data-itemtype' => "{$itemType}",
				'innerHTML'     => "{$itemName}",
			),
		);
	}
}


Registry::registerBlock( __DIR__, CountDownSeparatorBlock::class );
