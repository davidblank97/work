<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='200471']">
		<xsl:copy-of select="."/>
		<param id="198924">
			<name>REVERSE DOWNSLOPE</name>
			<short_name></short_name>
			<desc>A schedule parameter to make the TRAVEL axis move in the reverse direction during downslope.</desc>
		</param>
		<param id="199425">
			<name>REVERSE TRAVEL DIRECTION</name>
			<short_name>REVERSE DIR</short_name>
			<desc>A schedule parameter to make the TRAVEL axis move in the reverse direction during the segment.</desc>
		</param>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>