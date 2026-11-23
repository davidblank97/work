<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="head[@model='H-PAW' or @model='H-GTAW']/axis[@name='wire']/vlp">
		<vlp>200</vlp>
	</xsl:template>	
	<xsl:template match="head[@model='H-PAW' or @model='H-GTAW']/axis[@name='wire']/vli">
		<vli>50</vli>
	</xsl:template>
	<xsl:template match="head[@model='H-PAW' or @model='H-GTAW']/axis[@name='wire']/vld">
		<vld>0</vld>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>