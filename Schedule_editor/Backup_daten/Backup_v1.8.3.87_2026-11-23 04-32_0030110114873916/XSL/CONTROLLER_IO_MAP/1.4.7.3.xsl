<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="iomap/gas_controller/io[@module='JASPER']/shield_flow_rate">
		<shield_flow_rate offset="27" analog_high="10" analog_low="-10" digital_high="0" digital_low="4095"  />
	</xsl:template>

	<xsl:template match="iomap/gas_controller/io[@module='JASPER']/trail_flow_rate">
		<trail_flow_rate offset="29" analog_high="10" analog_low="-10" digital_high="0" digital_low="4095"  />
	</xsl:template>

	<xsl:template match="iomap/gas_controller/io[@module='JASPER']/plasma_enable">
		<xsl:copy-of select="."/>
		<plasma_flow_rate offset="28" analog_high="10" analog_low="-10" digital_high="0" digital_low="4095"  />
	</xsl:template>

	<xsl:template match="iomap/spares/io[@module='JASPER']/spare_analog_input_2">
		<spare_analog_input_2 offset="21" analog_high="10" analog_low="-10" digital_high="0" digital_low="4095"/>
		<spare_analog_input_3 offset="22" analog_high="10" analog_low="-10" digital_high="0" digital_low="4095"/>
	</xsl:template>
	
	<xsl:template match="iomap/spares/io[@module='JASPER']/spare_analog_input_4/@digital_low">  
		<xsl:attribute name="digital_low">
			<xsl:value-of select="'4095'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="iomap/spares/io[@module='JASPER']/spare_analog_input_5/@digital_low">  
		<xsl:attribute name="digital_low">
			<xsl:value-of select="'4095'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="iomap/spares/io[@module='JASPER']/spare_analog_input_6/@digital_low">  
		<xsl:attribute name="digital_low">
			<xsl:value-of select="'4095'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="iomap/spares/io[@module='JASPER']/spare_analog_input_7/@digital_low">  
		<xsl:attribute name="digital_low">
			<xsl:value-of select="'4095'"/>
		</xsl:attribute>
	</xsl:template>
	
	<xsl:template match="iomap/spares/io[@module='JASPER']/spare_analog_input_8"/>
	<xsl:template match="iomap/spares/io[@module='JASPER']/spare_analog_input_9"/>
	<xsl:template match="iomap/spares/io[@module='JASPER']/spare_analog_input_10"/>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>