<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output omit-xml-declaration="yes" indent="no"/>
	<xsl:preserve-space elements="*"/>

	
	<!--Change value of offset for respective tags-->
    <xsl:variable name="PotZeroNewOffset" select="'19'"/>
    <xsl:variable name="PotOneNewOffset" select="'20'"/>
    <xsl:variable name="PotThreeNewOffset" select="'22'"/>
    <xsl:variable name="PotFourNewOffset" select="'25'"/>

	<xsl:template match="/iomap/position[@index='0']/io[@module='JASPER']/potentiometer/@offset">
		<xsl:attribute name="offset">
			<xsl:value-of select="$PotZeroNewOffset"/>
		</xsl:attribute>
	</xsl:template>

	<xsl:template match="/iomap/position[@index='1']/io[@module='JASPER']/potentiometer/@offset">
		<xsl:attribute name="offset">
			<xsl:value-of select="$PotOneNewOffset"/>
		</xsl:attribute>
	</xsl:template>
	
	<xsl:template match="/iomap/position[@index='3']/io[@module='JASPER']/potentiometer/@offset">
		<xsl:attribute name="offset">
			<xsl:value-of select="$PotThreeNewOffset"/>
		</xsl:attribute>
	</xsl:template>
	
	<xsl:template match="/iomap/position[@index='4']/io[@module='JASPER']/potentiometer/@offset">
		<xsl:attribute name="offset">
			<xsl:value-of select="$PotFourNewOffset"/>
		</xsl:attribute>
	</xsl:template>
	
	<!--Remove tag position@index=5-->
	<xsl:template match="/iomap/position[@index='5']"/> 

	<!--Add Pot@channel=21 to position@index=2-->
	<xsl:template match="/iomap/position[@index='2']/io[@module='JASPER']">
		<io module="JASPER">
			<potentiometer offset="21" analog_high="10" analog_low="-10" digital_high="0" digital_low="4095" />
			<encoder offset="89" analog_high="24" analog_low="-24" digital_high="65535" digital_low="0"/>
		</io>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>