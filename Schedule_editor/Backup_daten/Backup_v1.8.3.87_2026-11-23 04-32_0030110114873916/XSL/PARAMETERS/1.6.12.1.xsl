<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/Parameters/param[@id='265729']">
		<xsl:copy-of select="."/>
			<param id="206851">
				<name>TRAVEL COMPENSATED BY WIDTH LICENSE ENABLED</name>
				<short_name>TRAVEL COMPENSATED BY WIDTH</short_name>
				<desc>Referring to enabling/disabling license for travel speed compensation when osc width changes.</desc>
			</param>
			<param id="206852">
				<name>TRAVEL COMPENSATED BY HEIGHT LICENSE ENABLED</name>
				<short_name>TRAVEL COMPENSATED BY HEIGHT</short_name>
				<desc>Referring to enabling/disabling license for travel speed compensation when avc height changes.</desc>
			</param>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>